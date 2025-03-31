// db/index.js
const { Sequelize } = require('sequelize')
const config = require('../config/database')
const fs = require('fs')
const path = require('path')

// Получаем конфигурацию в зависимости от окружения
const env = process.env.NODE_ENV || 'development'
const dbConfig = config[env]

// Создаем экземпляр Sequelize
const sequelize = new Sequelize(
	dbConfig.database,
	dbConfig.username,
	dbConfig.password,
	{
		host: dbConfig.host,
		port: dbConfig.port,
		dialect: dbConfig.dialect || 'postgres',
		logging: dbConfig.logging || false,
		define: {
			underscored: true,
			timestamps: true,
			createdAt: 'created_at',
			updatedAt: 'updated_at',
		},
	}
)

const db = {}

// Динамически загружаем все модели
const modelsDir = path.join(__dirname, '../models')
fs.readdirSync(modelsDir)
	.filter((file) => {
		return (
			file.indexOf('.') !== 0 && file !== 'index.js' && file.slice(-3) === '.js'
		)
	})
	.forEach((file) => {
		const model = require(path.join(modelsDir, file))(sequelize)
		db[model.name] = model
	})

// Устанавливаем ассоциации между моделями
// Этот шаг нужно выполнять после того, как все модели загружены
Object.keys(db).forEach((modelName) => {
	if (db[modelName].associate) {
		db[modelName].associate(db)
	}
})

db.sequelize = sequelize
db.Sequelize = Sequelize

module.exports = db
