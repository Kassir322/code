process.env.NODE_ENV = 'test' // Устанавливаем окружение
const axios = require('axios')
const bcrypt = require('bcrypt')
const db = require('../db')
const { User, Category, StudyCard } = db

// URL API
const API_URL = 'http://localhost:3000/api'

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

// Функция для получения товара по ID
async function getStudyCardById(id) {
	try {
		const response = await axios.get(`${API_URL}/study-cards/${id}`)
		return response.data
	} catch (error) {
		console.error(
			'Ошибка при получении товара:',
			error.response?.data || error.message
		)
		throw error
	}
}

// Функция для обновления товара
async function updateStudyCard(id, token, updateData) {
	try {
		const response = await axios.put(
			`${API_URL}/study-cards/${id}`,
			updateData,
			{
				headers: {
					Authorization: `Bearer ${token}`,
				},
			}
		)
		return response.data
	} catch (error) {
		console.error(
			'Ошибка при обновлении товара:',
			error.response?.data || error.message
		)
		throw error
	}
}

// Функция для удаления товара
async function deleteStudyCard(id, token) {
	try {
		const response = await axios.delete(`${API_URL}/study-cards/${id}`, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		})
		return response.data
	} catch (error) {
		console.error(
			'Ошибка при удалении товара:',
			error.response?.data || error.message
		)
		throw error
	}
}

// Основная функция тестирования
async function runTest() {
	const timestamp = new Date().toISOString().replace(/[:.]/g, '-')

	try {
		// Устанавливаем соединение с базой данных
		await db.sequelize.authenticate()
		console.log('Соединение с базой данных установлено')

		// Создаем тестового администратора, если его нет
		let adminUser = await User.findOne({
			where: { email: 'testadmin@example.com' },
		})

		if (!adminUser) {
			// Создаем нового администратора
			const hashedPassword = await bcrypt.hash('admin123', 10)
			adminUser = await User.create({
				name: 'Test Admin',
				email: 'testadmin@example.com',
				password: hashedPassword,
				roles: ['admin'],
				phone: '+79991234567',
			})
			console.log('Создан тестовый администратор:', adminUser.id)
		} else {
			console.log('Найден существующий тестовый администратор:', adminUser.id)
		}

		// Получаем токен
		const token = await login('testadmin@example.com', 'admin123')
		console.log('Токен получен:', token)

		// Получаем или создаем тестовую категорию
		let category = await Category.findOne({ where: { slug: 'test-category' } })

		if (!category) {
			category = await Category.create({
				name: 'Тестовая категория',
				slug: 'test-category',
				description: 'Описание тестовой категории',
				is_active: true,
			})
			console.log('Создана тестовая категория:', category.id)
		} else {
			console.log('Найдена существующая тестовая категория:', category.id)
		}

		// Создаем тестовую карточку для операций
		const testStudyCard = await StudyCard.create({
			title: `Тестовая карточка для операций ${timestamp}`,
			description: 'Описание тестовой карточки для операций',
			price: 599.99,
			quantity: 50,
			image_url: 'https://example.com/test_ops.jpg',
			subject: 'Информатика',
			school_grades: [8, 9],
			card_type: 'Учебные карточки',
			number_of_cards: 40,
			category_id: category.id,
			is_active: true,
		})

		console.log('Создана тестовая карточка для операций:', testStudyCard.id)

		// 1. Тестируем получение карточки по ID
		console.log('\n1. Получение карточки по ID:')
		const fetchedCard = await getStudyCardById(testStudyCard.id)
		console.log('Получена карточка:', fetchedCard.title)

		// 2. Тестируем обновление карточки
		console.log('\n2. Обновление карточки:')
		const updateData = {
			title: `Обновленная карточка ${timestamp}`,
			price: 649.99,
			description: 'Обновленное описание карточки',
		}

		const updatedCard = await updateStudyCard(
			testStudyCard.id,
			token,
			updateData
		)
		console.log('Карточка успешно обновлена:')
		console.log('- Новое название:', updatedCard.title)
		console.log('- Новая цена:', updatedCard.price)

		// 3. Мы не будем удалять карточку, чтобы она осталась в БД для проверки
		// Но покажем как это сделать (закомментированный код)
		console.log('\n3. Удаление карточки (закомментировано):')
		/*
    const deleteResult = await deleteStudyCard(testStudyCard.id, token)
    console.log('Карточка успешно удалена:', deleteResult.message)
    */
		console.log('Пропускаем удаление, чтобы сохранить карточку в БД')

		console.log('\nТестирование операций с товаром завершено успешно!')
		console.log(
			`Созданная карточка с ID ${testStudyCard.id} доступна для проверки в БД`
		)
	} catch (error) {
		console.error('Ошибка при выполнении теста:', error)
	} finally {
		// Закрываем соединение с базой данных
		await db.sequelize.close()
		console.log('Соединение с базой данных закрыто')
	}
}

// Запускаем тест
runTest()
