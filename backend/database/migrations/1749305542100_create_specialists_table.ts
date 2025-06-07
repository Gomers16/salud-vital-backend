import { BaseSchema } from '@adonisjs/lucid/schema' // ¡Importación corregida!

export default class extends BaseSchema {
  protected tableName = 'specialists'

  async up() { // Función 'up' definida con 'async' directamente
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('nombre_completo', 255).notNullable()
      table.string('especialidad', 255).notNullable()
      table.string('registro_profesional', 255).notNullable().unique()
      table.json('dias_y_horas_atencion').nullable() // Columna JSON para los horarios
      table.boolean('is_active').defaultTo(true).notNullable() // Para soft delete

      // Timestamps simplificados, como en tu ejemplo que funciona
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() { // Función 'down' definida con 'async' directamente
    this.schema.dropTable(this.tableName)
  }
}
