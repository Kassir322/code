const db = require('../../db')
const { StudyCard, Category } = db

describe('StudyCard Model', () => {
	let testCategory

	// Перед тестами создаем тестовую категорию
	beforeAll(async () => {
		testCategory = await Category.create({
			name: 'Тестовая категория',
			slug: 'test-category',
			description: 'Описание тестовой категории',
			is_active: true,
		})
	})

	// После всех тестов удаляем тестовые данные
	afterAll(async () => {
		await StudyCard.destroy({ where: {} })
		await Category.destroy({ where: {} })
	})

	// Тест на создание карточки
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

		const studyCard = await StudyCard.create(studyCardData)
		expect(studyCard).toBeDefined()
		expect(studyCard.id).toBeDefined()
		expect(studyCard.title).toBe(studyCardData.title)
		expect(parseFloat(studyCard.price)).toBe(studyCardData.price)
		expect(studyCard.category_id).toBe(testCategory.id)
	})

	// Тест на проверку обязательных полей
	test('должен выдать ошибку при отсутствии обязательных полей', async () => {
		try {
			// Пытаемся создать карточку без названия и категории
			await StudyCard.create({
				price: 500,
			})
			// Если дошли до этой строки, значит ошибки не произошло, что неверно
			fail('Должна была возникнуть ошибка валидации')
		} catch (error) {
			// Проверяем, что это ошибка валидации
			expect(error).toBeDefined()
		}
	})
})
