// routes/userRoutes.js
const express = require('express')
const router = express.Router()
const UserController = require('../controllers/UserController')
const authMiddleware = require('../middlewares/authMiddleware')

// Публичные маршруты (не требуют авторизации)
router.post('/register', UserController.createUser)
router.post('/login', UserController.loginUser)

// Защищенные маршруты (требуют авторизации)
router.get('/me', authMiddleware, UserController.getCurrentUser)
router.get('/:id', authMiddleware, UserController.getUserById)
router.put('/:id', authMiddleware, UserController.updateUser)
router.delete('/:id', authMiddleware, UserController.deleteUser)

// Маршруты только для администраторов
router.get('/', authMiddleware, UserController.getAllUsers)
router.patch('/:id/roles', authMiddleware, UserController.updateUserRole)

module.exports = router
