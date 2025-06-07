Proyecto Clínica Vital - Backend
Requisitos previos

    Node.js v22+

    MySQL instalado

Configuración rápida

    Clonar repositorio:

bash

git clone <repo-url>
cd clinica-vital-backend

    Instalar dependencias:

bash

npm install

    Configurar base de datos:

bash

echo "DB_USER=tu_usuario\nDB_PASSWORD=tu_contraseña\nDB_DATABASE=clinica_vital" > .env

    Crear y poblar la base de datos:

bash

node ace migration:run

    Iniciar servidor:

bash

npm run dev

El servidor estará disponible en: http://localhost:3333
Endpoints principales

    GET /specialists - Lista de especialistas

    POST /specialists - Crear especialista

    PUT /specialists/:id - Actualizar especialista

    DELETE /specialists/:id - Desactivar especialista

Característica clave

Validación automática de horarios para evitar traslapes en la agenda médica.

Autor

Diego Gómez - Examen Backend
