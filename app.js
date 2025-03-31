// app.js
const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const morgan = require('morgan')
const { sequelize } = require('./db')
const routes = require('./routes')
require('dotenv').config()

// Инициализация приложения Express
const app = express()
const PORT = process.env.PORT || 3000

// Middleware
app.use(cors()) // Разрешаем кросс-доменные запросы
app.use(helmet()) // Безопасность
app.use(morgan('dev')) // Логирование запросов
app.use(express.json()) // Парсинг JSON
app.use(express.urlencoded({ extended: true })) // Парсинг URL-encoded данных

// Подключение маршрутов
app.use('/api', routes)

// Обработка ошибок 404
app.use((req, res) => {
	res.status(404).json({ message: 'Ресурс не найден' })
})

// Общая обработка ошибок
app.use((err, req, res, next) => {
	console.error(err.stack)
	res.status(500).json({ message: 'Внутренняя ошибка сервера' })
})

// Запуск сервера
const startServer = async () => {
	try {
		// Синхронизация моделей с базой данных
		// В продакшене лучше использовать миграции вместо sync()
		// await sequelize.sync({ force: false });

		app.listen(PORT, () => {
			console.log(`Сервер запущен на порту ${PORT}`)
		})
	} catch (error) {
		console.error('Ошибка при запуске сервера:', error)
		process.exit(1)
	}
}

startServer()
