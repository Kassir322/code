// routes/orderRoutes.js
const express = require('express')
const router = express.Router()
const OrderController = require('../controllers/OrderController')
const authMiddleware = require('../middlewares/authMiddleware')

// Все маршруты требуют авторизации
router.use(authMiddleware)

// Маршруты для всех авторизованных пользователей
router.get('/user', OrderController.getUserOrders) // получение заказов текущего пользователя
router.get('/:id', OrderController.getOrderById) // получение деталей заказа
router.post('/', OrderController.createOrder) // создание нового заказа
router.post('/:id/cancel', OrderController.cancelOrder) // отмена заказа пользователем

// Маршруты только для администраторов (проверка на админа внутри контроллера)
router.get('/', OrderController.getAllOrders) // получение всех заказов
router.patch('/:id/status', OrderController.updateOrderStatus) // обновление статуса заказа
router.get('/statistics/summary', OrderController.getOrdersStatistics) // получение статистики

module.exports = router
