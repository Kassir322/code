process.env.NODE_ENV = 'test' // Важно установить тестовое окружение

const db = require('../db')
const config = require('../config/database')
const dbCleaner = require('../utils/db-cleaner')

async function cleanupTestDatabase() {
	try {
		// Получаем конфигурацию тестовой БД
		const dbConfig = config.test
		console.log(
			`Очистка тестовой базы данных: ${dbConfig.database} на ${dbConfig.host}:${dbConfig.port}`
		)

		// Подключаемся к базе данных
		await db.sequelize.authenticate()
		console.log('Соединение с тестовой базой данных установлено')

		// Очищаем все таблицы
		await dbCleaner.cleanDatabase('test')

		console.log('Тестовая база данных успешно очищена!')
	} catch (error) {
		console.error('Ошибка при очистке тестовой базы данных:', error)
	} finally {
		// Закрываем соединение
		await db.sequelize.close()
		console.log('Соединение с тестовой базой данных закрыто')
	}
}

// Запускаем очистку
cleanupTestDatabase()
