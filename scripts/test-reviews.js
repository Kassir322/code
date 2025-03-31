process.env.NODE_ENV = 'test' // Устанавливаем окружение
const axios = require('axios')
const bcrypt = require('bcrypt')
const db = require('../db')
const { User, Category, StudyCard, Review } = db

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

// Функция для получения отзывов товара
async function getStudyCardReviews(studyCardId) {
	try {
		const response = await axios.get(
			`${API_URL}/reviews/study-card/${studyCardId}`
		)
		return response.data
	} catch (error) {
		console.error(
			'Ошибка при получении отзывов:',
			error.response?.data || error.message
		)
		throw error
	}
}

// Функция для создания отзыва
async function createReview(token, reviewData) {
	try {
		const response = await axios.post(`${API_URL}/reviews`, reviewData, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		})
		return response.data
	} catch (error) {
		console.error(
			'Ошибка при создании отзыва:',
			error.response?.data || error.message
		)
		throw error
	}
}

// Функция для обновления отзыва
async function updateReview(id, token, updateData) {
	try {
		const response = await axios.put(`${API_URL}/reviews/${id}`, updateData, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		})
		return response.data
	} catch (error) {
		console.error(
			'Ошибка при обновлении отзыва:',
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

		// Получаем токен
		const token = await login('testuser@example.com', 'user123')
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

		// Создаем тестовый товар для отзывов, если в базе нет товаров
		let studyCard = await StudyCard.findOne()

		if (!studyCard) {
			studyCard = await StudyCard.create({
				title: `Тестовая карточка для отзывов ${timestamp}`,
				description: 'Описание тестовой карточки для отзывов',
				price: 799.99,
				quantity: 100,
				image_url: 'https://example.com/test_review.jpg',
				subject: 'Физика',
				school_grades: [10, 11],
				card_type: 'Учебные карточки',
				number_of_cards: 60,
				category_id: category.id,
				is_active: true,
			})
			console.log('Создана тестовая карточка для отзывов:', studyCard.id)
		} else {
			console.log('Найдена существующая карточка для отзывов:', studyCard.id)
		}

		// Проверяем, оставлял ли пользователь уже отзыв на этот товар
		let existingReview = await Review.findOne({
			where: {
				study_card_id: studyCard.id,
				user_id: testUser.id,
			},
		})

		if (existingReview) {
			console.log(
				'Пользователь уже оставил отзыв для этого товара:',
				existingReview.id
			)
			console.log('Рейтинг:', existingReview.rating)
			console.log('Комментарий:', existingReview.comment)

			// 1. Обновляем существующий отзыв
			console.log('\n1. Обновление существующего отзыва:')
			const updatedReview = await updateReview(existingReview.id, token, {
				rating: 5,
				comment: `Обновленный отзыв ${timestamp}`,
			})

			console.log('Отзыв успешно обновлен:')
			console.log('- ID:', updatedReview.id)
			console.log('- Новый рейтинг:', updatedReview.rating)
			console.log('- Новый комментарий:', updatedReview.comment)
		} else {
			// 1. Создаем новый отзыв
			console.log('\n1. Создание нового отзыва:')
			const newReview = await createReview(token, {
				study_card_id: studyCard.id,
				rating: 4,
				comment: `Отличные карточки! Тестовый отзыв ${timestamp}`,
			})

			console.log('Создан новый отзыв:')
			console.log('- ID:', newReview.id)
			console.log('- Рейтинг:', newReview.rating)
			console.log('- Комментарий:', newReview.comment)
		}

		// 2. Получаем все отзывы для товара
		console.log('\n2. Получение всех отзывов для товара:')
		const reviews = await getStudyCardReviews(studyCard.id)
		console.log(
			`Получено ${reviews.reviews.length} отзывов из ${reviews.total}`
		)

		if (reviews.reviews.length > 0) {
			console.log('Последний отзыв:')
			const lastReview = reviews.reviews[0]
			console.log('- Пользователь:', lastReview.user.name)
			console.log('- Рейтинг:', lastReview.rating)
			console.log('- Комментарий:', lastReview.comment)
		}

		console.log('\nТестирование отзывов завершено успешно!')
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
