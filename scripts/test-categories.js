process.env.NODE_ENV = 'test' // Устанавливаем окружение
const axios = require('axios')
const bcrypt = require('bcrypt')
const db = require('../db')
const { User, Category } = db

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

// Функция для получения всех категорий
async function getAllCategories() {
	try {
		const response = await axios.get(`${API_URL}/categories`)
		return response.data
	} catch (error) {
		console.error(
			'Ошибка при получении категорий:',
			error.response?.data || error.message
		)
		throw error
	}
}

// Функция для получения категории по ID
async function getCategoryById(id) {
	try {
		const response = await axios.get(`${API_URL}/categories/${id}`)
		return response.data
	} catch (error) {
		console.error(
			'Ошибка при получении категории:',
			error.response?.data || error.message
		)
		throw error
	}
}

// Функция для получения категории по slug
async function getCategoryBySlug(slug) {
	try {
		const response = await axios.get(`${API_URL}/categories/slug/${slug}`)
		return response.data
	} catch (error) {
		console.error(
			'Ошибка при получении категории по slug:',
			error.response?.data || error.message
		)
		throw error
	}
}

// Функция для создания категории
async function createCategory(token, categoryData) {
	try {
		const response = await axios.post(`${API_URL}/categories`, categoryData, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		})
		return response.data
	} catch (error) {
		console.error(
			'Ошибка при создании категории:',
			error.response?.data || error.message
		)
		throw error
	}
}

// Функция для обновления категории
async function updateCategory(id, token, updateData) {
	try {
		const response = await axios.put(
			`${API_URL}/categories/${id}`,
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
			'Ошибка при обновлении категории:',
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

		// 1. Получаем список всех категорий
		console.log('\n1. Получение всех категорий:')
		const categories = await getAllCategories()
		console.log(`Получено ${categories.length} категорий`)

		// 2. Создаем новую категорию
		console.log('\n2. Создание новой категории:')
		const newCategory = await createCategory(token, {
			name: `Тестовая категория ${timestamp}`,
			slug: `test-category-${timestamp}`,
			description: 'Описание тестовой категории',
			is_active: true,
		})

		console.log('Создана новая категория:')
		console.log('- ID:', newCategory.id)
		console.log('- Название:', newCategory.name)
		console.log('- Slug:', newCategory.slug)

		// 3. Получаем категорию по ID
		console.log('\n3. Получение категории по ID:')
		const categoryById = await getCategoryById(newCategory.id)
		console.log('Получена категория по ID:', categoryById.name)

		// 4. Получаем категорию по slug
		console.log('\n4. Получение категории по slug:')
		const categoryBySlug = await getCategoryBySlug(newCategory.slug)
		console.log('Получена категория по slug:', categoryBySlug.name)

		// 5. Обновляем категорию
		console.log('\n5. Обновление категории:')
		const updatedCategory = await updateCategory(newCategory.id, token, {
			name: `Обновленная категория ${timestamp}`,
			description: 'Обновленное описание категории',
		})

		console.log('Категория успешно обновлена:')
		console.log('- Новое название:', updatedCategory.name)
		console.log('- Новое описание:', updatedCategory.description)

		console.log('\nТестирование категорий завершено успешно!')
		console.log(
			`Созданная категория с ID ${newCategory.id} доступна для проверки в БД`
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
