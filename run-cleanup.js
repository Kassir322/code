const { exec } = require('child_process')
const path = require('path')
require('dotenv').config()

const dbConfig = {
	username: process.env.DB_USERNAME || 'postgres',
	password: process.env.DB_PASSWORD || 'postgres',
	database: process.env.DB_NAME || 'study_cards_shop_test',
	host: process.env.DB_HOST || 'localhost',
	port: process.env.DB_PORT || 5432,
}

// Путь к SQL файлу очистки
const cleanupScriptPath = path.join(__dirname, 'cleanup-test-db.sql')

// Формируем команду psql для запуска скрипта
const command = `PGPASSWORD=${dbConfig.password} psql -h ${dbConfig.host} -p ${dbConfig.port} -U ${dbConfig.username} -d ${dbConfig.database} -f ${cleanupScriptPath}`

console.log('Запуск скрипта очистки базы данных...')

// Выполняем команду
exec(command, (error, stdout, stderr) => {
	if (error) {
		console.error(`Ошибка при выполнении скрипта очистки: ${error.message}`)
		return
	}

	if (stderr) {
		console.error(`Ошибки/предупреждения: ${stderr}`)
	}

	console.log(`Результат выполнения: ${stdout}`)
	console.log('База данных успешно очищена!')
})
