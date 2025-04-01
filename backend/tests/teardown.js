const db = require('../db')
const dbCleaner = require('../utils/db-cleaner')

// Функция для очистки и закрытия соединений после завершения всех тестов
module.exports = async () => {
	try {
		console.log('Очистка тестовой базы данных после тестов...')

		// Очищаем все таблицы
		await dbCleaner.cleanDatabase('test')

		// Закрываем соединение с базой данных
		await db.sequelize.close()
		console.log('Соединение с тестовой базой данных закрыто')
	} catch (error) {
		console.error('Ошибка при завершении тестов:', error)
		process.exit(1)
	}
}
