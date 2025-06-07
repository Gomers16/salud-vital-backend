import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm' // Importación corregida, similar a tu ejemplo

// Define la interfaz para la estructura de días y horas de atención
interface HorarioDia {
  dia: string
  rangos: { inicio: string; fin: string }[]
}

export default class Specialist extends BaseModel {
  @column({ isPrimary: true })
  declare id: number // Usamos 'declare' y 'id' numérico (asumiendo tu migración usa increments('id'))

  @column()
  declare nombre_completo: string // Usamos 'declare'

  @column()
  declare especialidad: string // Usamos 'declare'

  @column({ columnName: 'registro_profesional' }) // Si el nombre de la columna es diferente, especifícalo
  declare registro_profesional: string // Usamos 'declare'

  // Campo para días y horas de atención, casteado como JSON
  @column({
    serializeAs: 'dias_y_horas_atencion',
    prepare: (value: HorarioDia[] | null) => JSON.stringify(value),
    consume: (value: string) => (value ? JSON.parse(value) : null),
  })
  declare dias_y_horas_atencion: HorarioDia[] | null // Usamos 'declare'

  @column()
  declare is_active: boolean // Usamos 'declare' (el valor por defecto se maneja en la migración)

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime // Usamos 'declare'

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime // Usamos 'declare'
}