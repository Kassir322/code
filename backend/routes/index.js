// routes/index.js
const express = require('express')
const userRoutes = require('./userRoutes')
const categoryRoutes = require('./categoryRoutes')
const studyCardRoutes = require('./studyCardRoutes')
const orderRoutes = require('./orderRoutes')
const reviewRoutes = require('./reviewRoutes')

const router = express.Router()

// Подключаем все маршруты с соответствующими префиксами
router.use('/users', userRoutes)
router.use('/categories', categoryRoutes)
router.use('/study-cards', studyCardRoutes)
router.use('/orders', orderRoutes)
router.use('/reviews', reviewRoutes)

module.exports = router
