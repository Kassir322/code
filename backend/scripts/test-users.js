process.env.NODE_ENV = 'test' // Устанавливаем окружение
const axios = require('axios')
const bcrypt = require('bcrypt')
const db = require('../db')
const { User } = db

// URL API
const API_URL = 'http://localhost:3000/api'

// Функция для регистрации пользователя
async function registerUser(userData) {
	try {
		const response = await axios.post(`${API_URL}/users/register`, userData)
		return response.data
	} catch (error) {
		console.error(
			'Ошибка при регистрации пользователя:',
			error.response?.data || error.message
		)
		throw error
	}
}

// Функция для авторизации пользователя
async function loginUser(email, password) {
	try {
		const response = await axios.post(`${API_URL}/users/login`, {
			email,
			password,
		})
		return response.data
	} catch (error) {
		console.error(
			'Ошибка при авторизации пользователя:',
			error.response?.data || error.message
		)
		throw error
	}
}

// Функция для получения профиля текущего пользователя
async function getCurrentUser(token) {
	try {
		const response = await axios.get(`${API_URL}/users/me`, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		})
		return response.data
	} catch (error) {
		console.error(
			'Ошибка при получении профиля пользователя:',
			error.response?.data || error.message
		)
		throw error
	}
}

// Функция для обновления данных пользователя
async function updateUser(token, id, userData) {
	try {
		const response = await axios.put(`${API_URL}/users/${id}`, userData, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		})
		return response.data
	} catch (error) {
		console.error(
			'Ошибка при обновлении данных пользователя:',
			error.response?.data || error.message
		)
		throw error
	}
}

// Функция для обновления роли пользователя (только для админа)
async function updateUserRole(token, id, roles) {
	try {
		const response = await axios.patch(
			`${API_URL}/users/${id}/roles`,
			{ roles },
			{
				headers: {
					Authorization: `Bearer ${token}`,
				},
			}
		)
		return response.data
	} catch (error) {
		console.error(
			'Ошибка при обновлении роли пользователя:',
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

		// 1. Регистрация нового пользователя
		console.log('\n1. Регистрация нового пользователя:')
		const newUserEmail = `user.${timestamp}@example.com`
		const newUserPassword = 'test123'

		const userData = {
			name: `Тестовый пользователь ${timestamp}`,
			email: newUserEmail,
			password: newUserPassword,
			phone: '+79991234500',
		}

		const registeredUser = await registerUser(userData)
		console.log('Пользователь успешно зарегистрирован:')
		console.log('- ID:', registeredUser.id)
		console.log('- Имя:', registeredUser.name)
		console.log('- Email:', registeredUser.email)

		// 2. Авторизация нового пользователя
		console.log('\n2. Авторизация нового пользователя:')
		const authData = await loginUser(newUserEmail, newUserPassword)
		console.log('Пользователь успешно авторизован')
		console.log('- Получен токен:', authData.token.substring(0, 20) + '...')

		// 3. Получение профиля пользователя
		console.log('\n3. Получение профиля пользователя:')
		const userProfile = await getCurrentUser(authData.token)
		console.log('Получен профиль пользователя:')
		console.log('- ID:', userProfile.id)
		console.log('- Имя:', userProfile.name)
		console.log('- Email:', userProfile.email)
		console.log('- Роли:', userProfile.roles.join(', '))

		// 4. Обновление данных пользователя
		console.log('\n4. Обновление данных пользователя:')
		const updatedUserData = {
			name: `Обновленное имя ${timestamp}`,
			phone: '+79991234599',
		}

		const updatedUser = await updateUser(
			authData.token,
			userProfile.id,
			updatedUserData
		)
		console.log('Данные пользователя успешно обновлены:')
		console.log('- Новое имя:', updatedUser.name)
		console.log('- Новый телефон:', updatedUser.phone)

		// 5. Создаем администратора, если его нет
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

		// 6. Авторизуемся как администратор
		console.log('\n6. Авторизация администратора:')
		const adminAuth = await loginUser('testadmin@example.com', 'admin123')
		console.log('Администратор успешно авторизован')
		console.log('- Получен токен:', adminAuth.token.substring(0, 20) + '...')

		// 7. Обновление роли пользователя (как администратор)
		console.log('\n7. Обновление роли пользователя (как администратор):')
		const updatedRoles = ['customer', 'manager']
		const userWithUpdatedRoles = await updateUserRole(
			adminAuth.token,
			userProfile.id,
			updatedRoles
		)
		console.log('Роли пользователя успешно обновлены:')
		console.log('- Новые роли:', userWithUpdatedRoles.roles.join(', '))

		console.log('\nТестирование пользователей завершено успешно!')
		console.log(
			`Созданный пользователь с ID ${registeredUser.id} доступен для проверки в БД`
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
