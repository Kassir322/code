process.env.NODE_ENV = 'test' // Устанавливаем окружение
const axios = require('axios')
const bcrypt = require('bcrypt')
const db = require('../db')
const { User, Category, StudyCard, Order, OrderItem } = db

// URL API
const API_URL = 'http://localhost:3000/api'

// Функция для авторизации и получения токена
async function login(email, password) {
	try {
		const response = await axios.post(`${API_URL}/users/login`, {
			email,
			password,
		})
		return response.data
	} catch (error) {
		console.error(
			'Ошибка при авторизации:',
			error.response?.data || error.message
		)
		throw error
	}
}

// Функция для создания заказа
async function createOrder(token, orderData) {
	try {
		const response = await axios.post(`${API_URL}/orders`, orderData, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		})
		return response.data
	} catch (error) {
		console.error(
			'Ошибка при создании заказа:',
			error.response?.data || error.message
		)
		throw error
	}
}

// Функция для получения заказа по ID
async function getOrderById(token, id) {
	try {
		const response = await axios.get(`${API_URL}/orders/${id}`, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		})
		return response.data
	} catch (error) {
		console.error(
			'Ошибка при получении заказа:',
			error.response?.data || error.message
		)
		throw error
	}
}

// Функция для получения заказов пользователя
async function getUserOrders(token) {
	try {
		const response = await axios.get(`${API_URL}/orders/user`, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		})
		return response.data
	} catch (error) {
		console.error(
			'Ошибка при получении заказов пользователя:',
			error.response?.data || error.message
		)
		throw error
	}
}

// Функция для обновления статуса заказа (только для админа)
async function updateOrderStatus(token, id, status) {
	try {
		const response = await axios.patch(
			`${API_URL}/orders/${id}/status`,
			{ status },
			{
				headers: {
					Authorization: `Bearer ${token}`,
				},
			}
		)
		return response.data
	} catch (error) {
		console.error(
			'Ошибка при обновлении статуса заказа:',
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

		// Создаем тестового пользователя, если его нет
		let testUser = await User.findOne({
			where: { email: 'testuser@example.com' },
		})

		if (!testUser) {
			// Создаем нового пользователя
			const hashedPassword = await bcrypt.hash('user123', 10)
			testUser = await User.create({
				name: 'Test User',
				email: 'testuser@example.com',
				password: hashedPassword,
				roles: ['customer'],
				phone: '+79991234568',
			})
			console.log('Создан тестовый пользователь:', testUser.id)
		} else {
			console.log('Найден существующий тестовый пользователь:', testUser.id)
		}

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

		// Получаем токены
		console.log('\nАвторизация пользователя:')
		const userAuth = await login('testuser@example.com', 'user123')
		const userToken = userAuth.token
		console.log('Пользовательский токен получен')

		console.log('\nАвторизация администратора:')
		const adminAuth = await login('testadmin@example.com', 'admin123')
		const adminToken = adminAuth.token
		console.log('Администраторский токен получен')

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

		// Создаем тестовый товар для заказа
		const studyCard = await StudyCard.create({
			title: `Тестовая карточка для заказа ${timestamp}`,
			description: 'Описание тестовой карточки для заказа',
			price: 999.99,
			quantity: 100,
			image_url: 'https://example.com/test_order.jpg',
			subject: 'География',
			school_grades: [7, 8],
			card_type: 'Учебные карточки',
			number_of_cards: 45,
			category_id: category.id,
			is_active: true,
		})

		console.log('Создана тестовая карточка для заказа:', studyCard.id)

		// 1. Создаем заказ
		console.log('\n1. Создание заказа:')
		const orderData = {
			items: [
				{
					study_card_id: studyCard.id,
					quantity: 2,
				},
			],
			shipping_address: 'г. Москва, ул. Тестовая, д. 123, кв. 456',
			payment_method: 'card',
			shipping_method: 'courier',
		}

		const createdOrder = await createOrder(userToken, orderData)
		console.log('Заказ успешно создан:')
		console.log('- ID заказа:', createdOrder.id)
		console.log('- Сумма заказа:', createdOrder.total_amount)
		console.log('- Статус заказа:', createdOrder.status)
		console.log('- Количество позиций:', createdOrder.orderItems.length)

		// 2. Получаем заказ по ID
		console.log('\n2. Получение заказа по ID:')
		const fetchedOrder = await getOrderById(userToken, createdOrder.id)
		console.log('Получен заказ:')
		console.log('- ID заказа:', fetchedOrder.id)
		console.log('- Сумма заказа:', fetchedOrder.total_amount)
		console.log('- Статус заказа:', fetchedOrder.status)

		// 3. Получаем все заказы пользователя
		console.log('\n3. Получение всех заказов пользователя:')
		const userOrders = await getUserOrders(userToken)
		console.log(
			`Получено ${userOrders.orders.length} заказов из ${userOrders.total}`
		)

		// 4. Обновляем статус заказа (как администратор)
		console.log('\n4. Обновление статуса заказа (как администратор):')
		const newStatus = 'processing'
		const updatedOrder = await updateOrderStatus(
			adminToken,
			createdOrder.id,
			newStatus
		)
		console.log('Статус заказа успешно обновлен:')
		console.log('- Новый статус:', updatedOrder.order.status)

		// 5. Проверяем, что заказ действительно обновился
		console.log('\n5. Проверка актуального статуса заказа:')
		const verifyOrder = await getOrderById(userToken, createdOrder.id)
		console.log('Текущий статус заказа:', verifyOrder.status)

		console.log('\nТестирование заказов завершено успешно!')
		console.log(
			`Созданный заказ с ID ${createdOrder.id} доступен для проверки в БД`
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
