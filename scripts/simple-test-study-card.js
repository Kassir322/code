process.env.NODE_ENV = 'test'
const db = require('../db')
const { StudyCard, Category } = db

async function testCreateStudyCard() {
	try {
		console.log('Начинаем тест создания карточки...')

		// Подключаемся к базе данных
		await db.sequelize.authenticate()
		console.log('Соединение с базой данных установлено')

		// Создаем тестовую категорию
		const category = await Category.create({
			name: 'Тестовая категория',
			slug: 'test-category',
			description: 'Описание тестовой категории',
			is_active: true,
		})
		console.log('Тестовая категория создана с ID:', category.id)

		// Создаем тестовую карточку
		const studyCardData = {
			title: 'Тестовая учебная карточка',
			description: 'Описание тестовой учебной карточки',
			price: 999.99,
			quantity: 100,
			image_url: 'https://example.com/image.jpg',
			subject: 'Математика',
			school_grades: [5, 6, 7],
			card_type: 'Карточки для запоминания',
			number_of_cards: 50,
			category_id: category.id,
			is_active: true,
		}

		const studyCard = await StudyCard.create(studyCardData)
		console.log('Карточка успешно создана с ID:', studyCard.id)

		// Проверяем созданную карточку
		const fetchedCard = await StudyCard.findByPk(studyCard.id)
		console.log(
			'Проверка созданной карточки:',
			fetchedCard ? 'УСПЕШНО' : 'ОШИБКА'
		)

		if (fetchedCard) {
			console.log('Название:', fetchedCard.title)
			console.log('Цена:', fetchedCard.price)
			console.log('Категория:', fetchedCard.category_id)
		}

		console.log('Тест успешно завершен!')

		// Очищаем тестовые данные
		console.log('Очистка тестовых данных...')
		await studyCard.destroy()
		await category.destroy()
		console.log('Данные очищены')
	} catch (error) {
		console.error('Ошибка в тесте:', error)
	} finally {
		// Закрываем соединение с базой данных
		await db.sequelize.close()
		console.log('Соединение закрыто')
	}
}

// Запускаем тест
testCreateStudyCard()
