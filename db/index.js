// db/index.js
const { Sequelize } = require('sequelize')
const config = require('../config/database') // Предполагаем, что у вас есть файл с настройками БД
const fs = require('fs')
const path = require('path')

const sequelize = new Sequelize(
	config.database,
	config.username,
	config.password,
	{
		host: config.host,
		port: config.port,
		dialect: 'postgres',
		logging: config.logging ? console.log : false,
		define: {
			underscored: true,
			timestamps: true,
		},
	}
)

const db = {}

// Динамическая загрузка всех моделей из директории models
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

// Настраиваем ассоциации между моделями
Object.keys(db).forEach((modelName) => {
	if (db[modelName].associate) {
		db[modelName].associate(db)
	}
})

db.sequelize = sequelize
db.Sequelize = Sequelize

module.exports = db
