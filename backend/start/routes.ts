/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import SpecialistsController from '../app/controllers/specialists_controller.js' // ¡Ruta relativa directa!

router.get('/', async () => {
  return {
    hello: 'world',
  }
})

// Rutas para el CRUD completo de especialistas
// Ahora pasamos la clase del controlador directamente
router.resource('specialists', SpecialistsController).apiOnly()

// Rutas adicionales para el "soft delete" y eliminación definitiva/restauración
router.put('specialists/:id/restore', [SpecialistsController, 'restore'])
router.delete('specialists/:id/hard-delete', [SpecialistsController, 'hardDelete'])

