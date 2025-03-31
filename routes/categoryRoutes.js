// routes/categoryRoutes.js
const express = require('express')
const router = express.Router()
const CategoryController = require('../controllers/CategoryController')
const authMiddleware = require('../middlewares/authMiddleware')

// Публичные маршруты (не требуют авторизации)
router.get('/', CategoryController.getAllCategories)
router.get('/:id', CategoryController.getCategoryById)
router.get('/slug/:slug', CategoryController.getCategoryBySlug)
router.get('/:id/products', CategoryController.getCategoryProducts)

// Защищенные маршруты (требуют авторизации и прав администратора)
router.post('/', authMiddleware, CategoryController.createCategory)
router.put('/:id', authMiddleware, CategoryController.updateCategory)
router.delete('/:id', authMiddleware, CategoryController.deleteCategory)

module.exports = router
