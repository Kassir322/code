process.env.NODE_ENV = 'test' // Устанавливаем тестовое окружение до загрузки конфигураций
const config = require('../config/database')
const db = require('../db')

// Примечание: в глобальном setup мы не можем использовать глобальные функции Jest напрямую

// Функция для настройки тестовой БД
module.exports = async () => {
	// Получаем конфигурацию для тестового окружения
	const dbConfig = config.test

	console.log(
		`Настройка тестовой БД: ${dbConfig.database} на ${dbConfig.host}:${dbConfig.port}`
	)

	// Проверяем соединение с базой данных
	try {
		await db.sequelize.authenticate()
		console.log('Соединение с тестовой базой данных успешно установлено')

		// Синхронизируем модели с базой данных (создаем таблицы)
		await db.sequelize.sync({ force: true })
		console.log('Модели синхронизированы с тестовой базой данных')
	} catch (error) {
		console.error('Ошибка при подключении к тестовой базе данных:', error)
		process.exit(1)
	}
}
