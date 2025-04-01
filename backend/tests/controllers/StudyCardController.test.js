// tests/controllers/StudyCardController.test.js
const db = require('../../db')
const { StudyCard, Category, User } = db
const bcrypt = require('bcrypt')

describe('StudyCardController', () => {
	let testCategory
	let adminUser

	// Используем beforeAll для создания тестовых данных
	beforeAll(async () => {
		// Создаем тестовую категорию
		testCategory = await Category.create({
			name: 'Тестовая категория',
			slug: 'test-category',
			description: 'Описание тестовой категории',
			is_active: true,
		})

		// Создаем тестового администратора
		const hashedPassword = await bcrypt.hash('admin123', 10)
		adminUser = await User.create({
			name: 'Test Admin',
			email: 'admin@test.com',
			password: hashedPassword,
			roles: ['admin'],
			phone: '+79991234567',
		})
	})

	// После всех тестов удаляем тестовые данные
	// afterAll(async () => {
	// 	await StudyCard.destroy({ where: {} })
	// 	await Category.destroy({ where: {} })
	// 	await User.destroy({ where: {} })
	// })

	// Тест на создание карточки через модель (эмуляция функции контроллера)
	test('должен создать новую учебную карточку', async () => {
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
			category_id: testCategory.id,
			is_active: true,
		}

		// Эмулируем поведение контроллера без использования HTTP
		const studyCard = await StudyCard.create(studyCardData)

		expect(studyCard).toBeDefined()
		expect(studyCard.id).toBeDefined()
		expect(studyCard.title).toBe(studyCardData.title)
	})

	// Дополнительные тесты можно добавить здесь
})
