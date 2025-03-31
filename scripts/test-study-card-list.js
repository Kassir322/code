process.env.NODE_ENV = 'test' // Устанавливаем окружение
const axios = require('axios')
const db = require('../db')

// URL API
const API_URL = 'http://localhost:3000/api'

// Функция для получения списка товаров с фильтрацией
async function getStudyCards(queryParams = {}) {
	try {
		// Формируем URL с параметрами запроса
		let url = `${API_URL}/study-cards?`

		Object.keys(queryParams).forEach((key) => {
			url += `${key}=${queryParams[key]}&`
		})

		const response = await axios.get(url)
		return response.data
	} catch (error) {
		console.error(
			'Ошибка при получении списка товаров:',
			error.response?.data || error.message
		)
		throw error
	}
}

// Основная функция тестирования
async function runTest() {
	try {
		// Устанавливаем соединение с базой данных
		await db.sequelize.authenticate()
		console.log('Соединение с базой данных установлено')

		// Тестируем получение всех товаров (первая страница)
		console.log('\n1. Получение всех товаров (первая страница, 10 элементов):')
		const allItems = await getStudyCards({ page: 1, limit: 10 })
		console.log(
			`Получено ${allItems.studyCards.length} товаров из ${allItems.total}`
		)
		console.log('Первый товар:', allItems.studyCards[0]?.title || 'нет товаров')

		// Тестируем фильтрацию по предмету
		console.log('\n2. Фильтрация по предмету "Математика":')
		const mathItems = await getStudyCards({ subject: 'Математика' })
		console.log(
			`Получено ${mathItems.studyCards.length} товаров из ${mathItems.total}`
		)

		// Тестируем фильтрацию по диапазону цен
		console.log('\n3. Фильтрация по цене (от 500 до 1000):')
		const priceFilteredItems = await getStudyCards({
			min_price: 500,
			max_price: 1000,
		})
		console.log(
			`Получено ${priceFilteredItems.studyCards.length} товаров из ${priceFilteredItems.total}`
		)

		// Тестируем сортировку (по цене по возрастанию)
		console.log('\n4. Сортировка по цене (по возрастанию):')
		const sortedItems = await getStudyCards({ sort: 'price', order: 'ASC' })
		console.log(
			`Получено ${sortedItems.studyCards.length} товаров из ${sortedItems.total}`
		)
		if (sortedItems.studyCards.length > 0) {
			console.log('Цены первых 3 товаров:')
			sortedItems.studyCards.slice(0, 3).forEach((item, index) => {
				console.log(`${index + 1}. ${item.title}: ${item.price}`)
			})
		}

		// Тестируем поиск
		const searchQuery = 'карточка'
		console.log(`\n5. Поиск по запросу "${searchQuery}":`)
		const searchResults = await getStudyCards({ search: searchQuery })
		console.log(
			`Получено ${searchResults.studyCards.length} товаров из ${searchResults.total}`
		)

		console.log('\nТестирование получения списка товаров завершено успешно!')
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
