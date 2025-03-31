const db = require('../db')
const config = require('../config/database')

/**
 * Очищает указанные таблицы в базе данных с помощью TRUNCATE CASCADE
 * @param {Array<string>} tables - Массив имен таблиц для очистки
 * @param {string} env - Окружение ('test', 'development', 'production')
 * @returns {Promise<void>}
 */
async function truncateTables(tables = [], env = 'test') {
	// Убедимся, что мы не очищаем production базу данных
	if (env === 'production') {
		throw new Error('Запрещено очищать таблицы в production среде')
	}

	// Получаем конфигурацию БД для указанного окружения
	const dbConfig = config[env]
	if (!dbConfig) {
		throw new Error(`Конфигурация для окружения "${env}" не найдена`)
	}

	console.log(
		`Очистка таблиц в базе данных "${dbConfig.database}" (${env} окружение)`
	)

	const tableNames =
		tables.length > 0
			? tables
			: Object.keys(db).filter(
					(model) =>
						typeof db[model] === 'function' &&
						db[model].prototype &&
						db[model].prototype.constructor.name === 'Model'
			  )

	try {
		// Отключаем временно внешние ключи (PostgreSQL использует другой синтаксис)
		await db.sequelize.query("SET session_replication_role = 'replica'")

		// Очищаем каждую таблицу
		for (const modelName of tableNames) {
			if (db[modelName] && typeof db[modelName].tableName === 'string') {
				await db.sequelize.query(
					`TRUNCATE TABLE "${db[modelName].tableName}" CASCADE`
				)
				console.log(`Таблица ${db[modelName].tableName} очищена`)
			}
		}

		// Включаем обратно проверку внешних ключей
		await db.sequelize.query("SET session_replication_role = 'origin'")

		console.log('Все таблицы успешно очищены')
	} catch (error) {
		console.error('Ошибка при очистке таблиц:', error)
		// Убедимся, что внешние ключи снова активны даже в случае ошибки
		await db.sequelize.query("SET session_replication_role = 'origin'")
		throw error
	}
}

/**
 * Очищает всю тестовую базу данных
 * @param {string} env - Окружение ('test', 'development', 'production')
 * @returns {Promise<void>}
 */
async function cleanDatabase(env = 'test') {
	await truncateTables(
		['reviews', 'order_items', 'orders', 'study_cards', 'categories', 'users'],
		env
	)
}

module.exports = {
	truncateTables,
	cleanDatabase,
}
