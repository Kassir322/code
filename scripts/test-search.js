process.env.NODE_ENV = 'test' // Устанавливаем окружение
const axios = require('axios')
const db = require('../db')
const { StudyCard, Category } = db

// URL API
const API_URL = 'http://localhost:3000/api'

// Функция для поиска товаров
async function searchStudyCards(searchQuery) {
	try {
		const response = await axios.get(
			`${API_URL}/study-cards?search=${encodeURIComponent(searchQuery)}`
		)
		return response.data
	} catch (error) {
		console.error(
			'Ошибка при поиске товаров:',
			error.response?.data || error.message
		)
		throw error
	}
}

// Функция для создания тестовых товаров с разными названиями
async function createTestStudyCards(category) {
	const timestamp = new Date().toISOString().replace(/[:.]/g, '-')

	// Массив названий для тестовых товаров
	const titles = [
		`Карточки по математике ${timestamp}`,
		`Учебные материалы по физике ${timestamp}`,
		`Химия для начинающих ${timestamp}`,
		`Тренажер по русскому языку ${timestamp}`,
		`Учимся читать ${timestamp}`,
	]

	const subjects = ['Математика', 'Физика', 'Химия', 'Русский язык', 'Чтение']
	const prices = [499.99, 599.99, 699.99, 799.99, 899.99]

	// Создаем карточки
	const createdCards = []

	for (let i = 0; i < titles.length; i++) {
		const studyCard = await StudyCard.create({
			title: titles[i],
			description: `Описание для "${titles[i]}"`,
			price: prices[i],
			quantity: 50 + i * 10,
			image_url: `https://example.com/image_${i}.jpg`,
			subject: subjects[i],
			school_grades: [5 + i],
			card_type: 'Учебные карточки',
			number_of_cards: 30 + i * 5,
			category_id: category.id,
			is_active: true,
		})

		createdCards.push(studyCard)
		console.log(`Создана карточка "${titles[i]}" с ID: ${studyCard.id}`)
	}

	return createdCards
}

// Основная функция тестирования
async function runTest() {
	try {
		// Устанавливаем соединение с базой данных
		await db.sequelize.authenticate()
		console.log('Соединение с базой данных установлено')

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

		// Создаем тестовые товары для поиска
		console.log('\nСоздание тестовых товаров для поиска:')
		const testCards = await createTestStudyCards(category)

		console.log('\nТестирование поиска:')

		// 1. Поиск по "математика"
		const searchQuery1 = 'математика'
		console.log(`\n1. Поиск по запросу "${searchQuery1}":`)
		const results1 = await searchStudyCards(searchQuery1)
		console.log(
			`Найдено ${results1.studyCards.length} товаров из ${results1.total}`
		)

		if (results1.studyCards.length > 0) {
			console.log('Найденные товары:')
			results1.studyCards.forEach((card, index) => {
				console.log(`${index + 1}. ${card.title} (ID: ${card.id})`)
			})
		}

		// 2. Поиск по "физика"
		const searchQuery2 = 'физика'
		console.log(`\n2. Поиск по запросу "${searchQuery2}":`)
		const results2 = await searchStudyCards(searchQuery2)
		console.log(
			`Найдено ${results2.studyCards.length} товаров из ${results2.total}`
		)

		if (results2.studyCards.length > 0) {
			console.log('Найденные товары:')
			results2.studyCards.forEach((card, index) => {
				console.log(`${index + 1}. ${card.title} (ID: ${card.id})`)
			})
		}

		// 3. Поиск по "учебные"
		const searchQuery3 = 'учебные'
		console.log(`\n3. Поиск по запросу "${searchQuery3}":`)
		const results3 = await searchStudyCards(searchQuery3)
		console.log(
			`Найдено ${results3.studyCards.length} товаров из ${results3.total}`
		)

		if (results3.studyCards.length > 0) {
			console.log('Найденные товары:')
			results3.studyCards.forEach((card, index) => {
				console.log(`${index + 1}. ${card.title} (ID: ${card.id})`)
			})
		}

		// 4. Поиск по несуществующему запросу
		const searchQuery4 = 'несуществующийтовар'
		console.log(`\n4. Поиск по запросу "${searchQuery4}":`)
		const results4 = await searchStudyCards(searchQuery4)
		console.log(
			`Найдено ${results4.studyCards.length} товаров из ${results4.total}`
		)

		console.log('\nТестирование поиска по каталогу завершено успешно!')
		console.log(`Созданные тестовые карточки доступны для проверки в БД`)
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
