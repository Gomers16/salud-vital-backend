import type { HttpContext } from '@adonisjs/core/http' 
import vine from '@vinejs/vine'
import Specialist from '#models/specialist'
import { Exception } from '@adonisjs/core/exceptions' // Esta importación sigue siendo necesaria para la excepción de traslapes

// Definimos la interfaz para la estructura de días y horas de atención (fuera de la clase)
interface HorarioDia {
  dia: string;
  rangos: { inicio: string; fin: string }[];
}

// -------------------------------------------------------------------------
// REGLA PERSONALIZADA DE VINEJS PARA VALIDAR QUE HORA DE INICIO < HORA DE FIN
// (CORRECCIÓN CRÍTICA: USANDO throw new Error() en lugar de helpers.report)
// -------------------------------------------------------------------------
const validateTimeRangeObject = vine.createRule((value: { inicio: string; fin: string }, helpers) => {
  const { inicio, fin } = value;

  const toMinutes = (time: string): number => {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  };

  const startMinutes = toMinutes(inicio);
  const endMinutes = toMinutes(fin);

  if (startMinutes >= endMinutes) {
    // --- CAMBIO CLAVE AQUÍ: LANZAMOS UN ERROR ESTÁNDAR ---
    throw new Error('La hora de inicio debe ser anterior a la hora de fin en cada rango.');
    // No necesitamos helpers.report() ya que el framework debería capturar este error
    // y VineJS lo convertirá en un error de validación.
    // El 'rule' se puede inferir o mapear en el catch.
    // --- FIN DEL CAMBIO ---
  }
});

export default class SpecialistsController {

  // -------------------------------------------------------------------------
  // Función de ayuda privada para verificar traslapes en rangos horarios
  // -------------------------------------------------------------------------
  private _checkOverlappingRanges(ranges: { inicio: string; fin: string }[], day: string): string | null {
    if (!ranges || ranges.length < 2) {
      return null;
    }

    const toMinutes = (time: string): number => {
      const [hours, minutes] = time.split(':').map(Number);
      return hours * 60 + minutes;
    };

    const sortedRanges = [...ranges].sort((a, b) => {
      return toMinutes(a.inicio) - toMinutes(b.inicio);
    });

    for (let i = 0; i < sortedRanges.length - 1; i++) {
      const currentRangeEnd = toMinutes(sortedRanges[i].fin);
      const nextRangeStart = toMinutes(sortedRanges[i + 1].inicio);

      if (currentRangeEnd > nextRangeStart) {
        return `Los rangos horarios para el día '${day}' se superponen.`;
      }
    }
    return null;
  }

  // 1. Obtener todos los especialistas
  public async index({ response }: HttpContext) {
    try {
      const specialists = await Specialist.all()
      return response.ok(specialists)
    } catch (error) {
      console.error('Error al obtener especialistas:', error)
      return response.status(500).json({ mensaje: 'Error al obtener especialistas' })
    }
  }

  // 2. Crear un nuevo especialista
  public async store({ request, response }: HttpContext) {
    const specialistSchema = vine.object({
      nombre_completo: vine.string().minLength(3),
      especialidad: vine.string(),
      registro_profesional: vine.string().unique(async (db, value) => {
        const specialist = await db.from('specialists').where('registro_profesional', value).first()
        return !specialist
      }),
      dias_y_horas_atencion: vine.array(
        vine.object({
          dia: vine.string(),
          rangos: vine.array(
            vine.object({
              inicio: vine.string().regex(/^\d{2}:\d{2}$/),
              fin: vine.string().regex(/^\d{2}:\d{2}$/),   
            }).use(validateTimeRangeObject()) // Aplicación de la regla personalizada
          ).minLength(1) 
        })
      ).nullable(),
    })

    try {
      // --- LÍNEAS DE DEPURACIÓN (puedes eliminarlas si no son necesarias) ---
      console.log('--- Depuración de Solicitud ---')
      console.log('Contenido de request.body() en el controlador:', request.body())
      console.log('Headers de la solicitud recibidos por AdonisJS:', request.headers())
      console.log('Content-Type específico recibido:', request.header('Content-Type'))
      console.log('--- Fin Depuración ---')
      // --- FIN LÍNEAS DE DEPURACIÓN ---

      const data = await request.validateUsing(vine.compile(specialistSchema))

      // --- VALIDACIÓN DE TRASLAPES INTERNOS (PUNTO 3 DEL EXAMEN) ---
      if (data.dias_y_horas_atencion) {
        for (const diaAtencion of data.dias_y_horas_atencion) {
          const overlapError = this._checkOverlappingRanges(diaAtencion.rangos, diaAtencion.dia);
          if (overlapError) {
            return response.status(422).json([{ 
              message: overlapError, 
              rule: 'E_OVERLAPPING_SCHEDULES' 
            }]);
          }
        }
      }
      // --- FIN VALIDACIÓN DE TRASLAPES ---

      const specialist = await Specialist.create({
        nombre_completo: data.nombre_completo,
        especialidad: data.especialidad,
        registro_profesional: data.registro_profesional,
        dias_y_horas_atencion: data.dias_y_horas_atencion,
        is_active: true
      })

      return response.created(specialist)
    } catch (error) {
      console.error('Error al crear especialista:', error)
      
      let statusCode = 500; 
      let responseMessage: any = { mensaje: 'Error interno del servidor', error: (error as any).message };

      // Si el error es una validación de VineJS, tiene la propiedad 'messages'
      if ((error as any).messages && Array.isArray((error as any).messages)) {
          statusCode = 422; 
          responseMessage = (error as any).messages;
      } else if (error && typeof error === 'object' && 'status' in error) {
          // Para otras excepciones que puedan tener un status definido por Adonis
          statusCode = (error as any).status;
          responseMessage = [{ message: (error as any).message, rule: (error as any).code || 'UNKNOWN_ERROR' }];
      }

      return response.status(statusCode).json(responseMessage);
    }
  }

  // 3. Ver los detalles de un especialista
  public async show({ params, response }: HttpContext) {
    try {
      const specialist = await Specialist.findOrFail(params.id)
      return response.ok(specialist)
    } catch (error) {
      console.error('Error al obtener especialista:', error)
      return response.status(404).json({ mensaje: 'Especialista no encontrado' })
    }
  }

  // 4. Actualizar un especialista por ID
  public async update({ params, request, response }: HttpContext) {
    const specialistSchema = vine.object({
      nombre_completo: vine.string().minLength(3).optional(),
      especialidad: vine.string().optional(),
      registro_profesional: vine.string().unique(async (db, value) => {
        const specialist = await db.from('specialists').where('registro_profesional', value).whereNot('id', params.id).first()
        return !specialist
      }).optional(),
      dias_y_horas_atencion: vine.array(
        vine.object({
          dia: vine.string(),
          rangos: vine.array(
            vine.object({
              inicio: vine.string().regex(/^\d{2}:\d{2}$/),
              fin: vine.string().regex(/^\d{2}:\d{2}$/),   
            }).use(validateTimeRangeObject()) // Aplicación de la regla personalizada
          ).minLength(1)
        })
      ).nullable().optional(), 
      is_active: vine.boolean().optional(),
    })

    try {
      const specialist = await Specialist.findOrFail(params.id)
      const data = await request.validateUsing(vine.compile(specialistSchema))

      // --- VALIDACIÓN DE TRASLAPES INTERNOS (PUNTO 3 DEL EXAMEN) ---
      if (data.dias_y_horas_atencion) {
        for (const diaAtencion of data.dias_y_horas_atencion) {
          const overlapError = this._checkOverlappingRanges(diaAtencion.rangos, diaAtencion.dia);
          if (overlapError) {
            return response.status(422).json([{ 
              message: overlapError, 
              rule: 'E_OVERLAPPING_SCHEDULES' 
            }]);
          }
        }
      }
      // --- FIN VALIDACIÓN DE TRASLAPES ---

      specialist.merge(data)
      await specialist.save()

      return response.ok(specialist)
    } catch (error) {
      console.error('Error al actualizar especialista:', error)
      
      let statusCode = 500;
      let responseMessage: any = { mensaje: 'Error interno del servidor', error: (error as any).message };

      if ((error as any).messages && Array.isArray((error as any).messages)) {
          statusCode = 422;
          responseMessage = (error as any).messages;
      } else if (error && typeof error === 'object' && 'status' in error) {
          statusCode = (error as any).status;
          responseMessage = [{ message: (error as any).message, rule: (error as any).code || 'UNKNOWN_ERROR' }];
      }

      return response.status(statusCode).json(responseMessage);
    }
  }

  // 5. "Eliminar" (Soft Delete) un especialista por ID
  public async destroy({ params, response }: HttpContext) {
    try {
      const specialist = await Specialist.findOrFail(params.id)
      specialist.is_active = false
      await specialist.save()
      return response.ok({ mensaje: 'Especialista marcado como inactivo correctamente' })
    } catch (error) {
      console.error('Error al marcar especialista como inactivo:', error)
      return response.status(500).json({ mensaje: 'Error al eliminar (inactivar) especialista' })
    }
  }

  // 6. Restaurar un especialista inactivo
  public async restore({ params, response }: HttpContext) {
    try {
      const specialist = await Specialist.findOrFail(params.id)
      specialist.is_active = true
      await specialist.save()
      return response.ok({ mensaje: 'Especialista restaurado correctamente' })
    } catch (error) {
      console.error('Error al restaurar especialista:', error)
      return response.status(500).json({ mensaje: 'Error al restaurar especialista' })
    }
  }

  // 7. Eliminar definitivamente un especialista por ID
  public async hardDelete({ params, response }: HttpContext) {
    try {
      const specialist = await Specialist.findOrFail(params.id)
      await specialist.delete()
      return response.ok({ mensaje: 'Especialista eliminado definitivamente' })
    } catch (error) {
      console.error('Error al eliminar especialista definitivamente:', error)
      return response.status(500).json({ mensaje: 'Error al eliminar especialista definitivamente' })
    }
  }
}