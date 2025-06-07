# Examen Backend - Proyecto Clínica Vital

Este repositorio contiene el backend de un sistema de gestión para una clínica, desarrollado con AdonisJS 6 y MySQL. El sistema está diseñado para gestionar especialistas médicos, horarios de atención y otros servicios relacionados.

### Tecnologías utilizadas
- **Backend**: AdonisJS 6
- **Base de Datos**: MySQL
- **Node.js**: 22.0.0
- **ORM**: Lucid (AdonisJS ORM)
- **Validación**: VineJS
- **Controladores**: Usados para manejar las peticiones HTTP y lógica de negocio
- **Excepciones**: Manejo de errores personalizado

---

## Requisitos

- **Node.js** (versión 22.0.0 o superior)
- **MySQL** (o cualquier base de datos compatible con MySQL)

---

## Instalación

1. **Clonar el repositorio**:

   ```bash
   git clone <URL del repositorio>
   cd <nombre del repositorio>

    Instalar dependencias:

    Ejecuta el siguiente comando para instalar las dependencias del proyecto:

npm install

Configurar el archivo .env:

Crea un archivo .env en la raíz del proyecto y coloca las siguientes variables de entorno:

TZ=UTC
PORT=3333
HOST=localhost
LOG_LEVEL=info
APP_KEY=2M5aBPF6MmQnsoAztqChEMN_Vack7VDt
NODE_ENV=development
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=Diego
DB_PASSWORD=Gomez1824
DB_DATABASE=clinica-vital

    DB_USER: El nombre de usuario para la base de datos.

    DB_PASSWORD: La contraseña del usuario de la base de datos.

    DB_DATABASE: El nombre de la base de datos que estás usando.

Crear la base de datos:

Si no has creado la base de datos, puedes hacerlo utilizando el siguiente comando SQL en MySQL:

CREATE DATABASE `clinica-vital`;

Ejecutar migraciones:

Para crear las tablas necesarias en la base de datos, ejecuta las migraciones de AdonisJS:

    node ace migration:run

Ejecución

    Iniciar el servidor de desarrollo:

    Para iniciar el servidor de desarrollo, ejecuta el siguiente comando:

    npm run dev

    El servidor se iniciará en http://localhost:3333.

    Verificación:

    Puedes acceder a las rutas que proporcionan los controladores para gestionar especialistas y horarios de atención.

Endpoints Principales

    Obtener todos los especialistas:

        Ruta: GET /specialists

        Descripción: Obtiene la lista de todos los especialistas registrados.

    Crear un especialista:

        Ruta: POST /specialists

        Descripción: Crea un nuevo especialista.

        Cuerpo:

        {
          "nombre_completo": "Dr. Juan Pérez",
          "especialidad": "Cardiología",
          "registro_profesional": "12345",
          "dias_y_horas_atencion": [
            {
              "dia": "Lunes",
              "rangos": [
                { "inicio": "08:00", "fin": "10:00" },
                { "inicio": "10:00", "fin": "12:00" }
              ]
            }
          ]
        }

    Actualizar un especialista:

        Ruta: PUT /specialists/:id

        Descripción: Actualiza la información de un especialista.

    Eliminar un especialista:

        Ruta: DELETE /specialists/:id

        Descripción: Marca un especialista como inactivo (soft delete).

Validaciones
Traslapes de horarios

Se implementa una validación que asegura que no haya traslapes de horarios para un mismo día. Si los rangos de tiempo se traslapan, la solicitud será rechazada.

Ejemplo de un traslape inválido:

{
  "dia": "Lunes",
  "rangos": [
    { "inicio": "08:00", "fin": "10:00" },
    { "inicio": "09:00", "fin": "11:00" }
  ]
}

Este caso arrojará un error:

{
  "message": "Los rangos horarios para el día 'Lunes' se superponen.",
  "rule": "E_OVERLAPPING_SCHEDULES"
}

Contribuciones

Si deseas contribuir al proyecto, por favor sigue los siguientes pasos:

    Haz un fork del repositorio.

    Crea una nueva rama (git checkout -b feature/nueva-funcionalidad).

    Realiza tus cambios y asegúrate de que las pruebas pasen.

    Haz un commit de tus cambios (git commit -am 'Añadir nueva funcionalidad').

    Envía un pull request.

Autor

Este proyecto fue creado por Diego Gómez como parte de un examen técnico.
Licencia

Este proyecto está bajo la Licencia MIT - consulta el archivo LICENSE para más detalles.

¡Gracias por revisar este proyecto!


---

### Explicación:

- **Tecnologías utilizadas**: He detallado las herramientas y frameworks que usas en el backend.
- **Instalación**: He incluido los pasos para clonar el repositorio, instalar dependencias, configurar el entorno y correr las migraciones.
- **Endpoints principales**: Una lista de los endpoints que puedes usar para interactuar con la API.
- **Validaciones**: Descripción de las validaciones de traslapes en los horarios y ejemplos de errores.
- **Contribuciones**: Instrucciones para quienes quieran colaborar en el proyecto.
  
Este README te ayudará a documentar y presentar tu examen de forma clara y profesional. Si necesitas modificar algún detalle o agregar más información, puedes hacerlo según tus necesidades.

Tú dijiste:
lo necesito super sencillo no tanta cosa por favor
ChatGPT Plus

Claro, aquí tienes un README.md más sencillo y directo para tu examen:

# Examen Backend - Proyecto Clínica Vital

Este repositorio contiene el backend de un sistema de gestión para una clínica, desarrollado con AdonisJS 6 y MySQL.

## Tecnologías utilizadas
- **Backend**: AdonisJS 6
- **Base de Datos**: MySQL
- **Node.js**: 22.0.0

---

## Instalación

1. **Clonar el repositorio**:

   ```bash
   git clone <URL del repositorio>
   cd <nombre del repositorio>

    Instalar dependencias:

npm install

Configurar el archivo .env:

Crea un archivo .env con los siguientes valores:

TZ=UTC
PORT=3333
HOST=localhost
LOG_LEVEL=info
APP_KEY=2M5aBPF6MmQnsoAztqChEMN_Vack7VDt
NODE_ENV=development
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=Diego
DB_PASSWORD=Gomez1824
DB_DATABASE=clinica-vital

Crear la base de datos (si no existe):

CREATE DATABASE `clinica-vital`;

Ejecutar migraciones:

    node ace migration:run

Ejecución

    Iniciar el servidor:

    npm run dev

    El servidor estará disponible en http://localhost:3333.

Endpoints principales

    GET /specialists: Obtiene la lista de especialistas.

    POST /specialists: Crea un nuevo especialista.

    PUT /specialists/:id: Actualiza la información de un especialista.

    DELETE /specialists/:id: Marca un especialista como inactivo.

Validaciones

    Traslapes de horarios: No se permite que los horarios de atención se traslapen en un mismo día.

Autor

Diego Gómez - Examen Backend
