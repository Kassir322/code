process.env.NODE_ENV = 'test' // Устанавливаем окружение

const axios = require('axios')
const bcrypt = require('bcrypt')
const db = require('../db')
const config = require('../config/database')
const dbCleaner = require('../utils/db-cleaner')

const { User, Category, StudyCard } = db

// URL API
const API_URL = 'http://localhost:3000/api'

// Функция для создания тестового администратора
async function createTestAdmin() {
	try {
		// Хешируем пароль
		const hashedPassword = await bcrypt.hash('admin123', 10)

		// Создаем администратора
		const admin = await User.create({
			name: 'Test Admin',
			email: 'testadmin@example.com',
			password: hashedPassword,
			roles: ['admin'],
			phone: '+79991234567',
		})

		console.log('Тестовый администратор создан:', admin.id)
		return admin
	} catch (error) {
		console.error('Ошибка при создании тестового администратора:', error)
		throw error
	}
}

// Функция для создания тестовой категории
async function createTestCategory() {
	try {
		const category = await Category.create({
			name: 'Тестовая категория',
			slug: 'test-category',
			description: 'Описание тестовой категории',
			is_active: true,
		})

		console.log('Тестовая категория создана:', category.id)
		return category
	} catch (error) {
		console.error('Ошибка при создании тестовой категории:', error)
		throw error
	}
}

// Функция для авторизации и получения токена
async function login(email, password) {
	try {
		const response = await axios.post(`${API_URL}/users/login`, {
			email,
			password,
		})

		return response.data.token
	} catch (error) {
		console.error(
			'Ошибка при авторизации:',
			error.response?.data || error.message
		)
		throw error
	}
}

// Функция для создания нового товара
async function createStudyCard(token, studyCardData) {
	try {
		const response = await axios.post(`${API_URL}/study-cards`, studyCardData, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		})

		return response.data
	} catch (error) {
		console.error(
			'Ошибка при создании товара:',
			error.response?.data || error.message
		)
		throw error
	}
}

// Основная функция тестирования
async function runTest() {
	console.log(
		'Используется конфигурация базы данных:',
		config[process.env.NODE_ENV || 'development']
	)

	try {
		// Устанавливаем соединение с базой данных
		await db.sequelize.authenticate()
		console.log('Соединение с базой данных установлено')

		// Создаем тестового администратора
		const admin = await createTestAdmin()

		// Создаем тестовую категорию
		const category = await createTestCategory()

		// Получаем токен
		const token = await login('testadmin@example.com', 'admin123')
		console.log('Токен получен:', token)

		// Данные нового товара
		const newStudyCard = {
			title: 'Карточки по математике',
			description: 'Карточки для изучения математики в 5 классе',
			price: 799.99,
			quantity: 50,
			image_url: 'https://example.com/math_cards.jpg',
			subject: 'Математика',
			school_grades: [5],
			card_type: 'Учебные карточки',
			number_of_cards: 30,
			category_id: category.id,
			is_active: true,
		}

		// Создаем товар
		const createdStudyCard = await createStudyCard(token, newStudyCard)
		console.log('Товар успешно создан:', createdStudyCard)

		// Проверяем, что товар действительно создан в базе данных
		const dbStudyCard = await StudyCard.findByPk(createdStudyCard.id)
		console.log(
			'Товар в базе данных:',
			dbStudyCard ? 'Существует' : 'Не найден'
		)

		if (dbStudyCard) {
			console.log('Проверка полей:')
			console.log(
				'- Название:',
				dbStudyCard.title === newStudyCard.title ? 'OK' : 'ОШИБКА'
			)
			console.log(
				'- Цена:',
				parseFloat(dbStudyCard.price) === newStudyCard.price ? 'OK' : 'ОШИБКА'
			)
			console.log(
				'- Категория:',
				dbStudyCard.category_id === newStudyCard.category_id ? 'OK' : 'ОШИБКА'
			)
		}

		console.log('Тестирование завершено успешно!')
	} catch (error) {
		console.error('Ошибка при выполнении теста:', error)
	} finally {
		// Очищаем тестовые данные
		console.log('Очистка тестовых данных...')
		await dbCleaner.cleanDatabase('test')

		// Закрываем соединение с базой данных
		await db.sequelize.close()
		console.log('Соединение с базой данных закрыто')
	}
}

// Запускаем тест
runTest()
