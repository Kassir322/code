// routes/index.js
const express = require('express')
const userRoutes = require('./userRoutes')
// Здесь можно подключить другие маршруты по мере их создания
// const categoryRoutes = require('./categoryRoutes');
// const studyCardRoutes = require('./studyCardRoutes');
// const orderRoutes = require('./orderRoutes');
// и т.д.

const router = express.Router()

// Подключаем маршруты пользователей по префиксу '/api/users'
router.use('/users', userRoutes)

// Подключаем другие маршруты
// router.use('/categories', categoryRoutes);
// router.use('/study-cards', studyCardRoutes);
// router.use('/orders', orderRoutes);
// и т.д.

module.exports = router
