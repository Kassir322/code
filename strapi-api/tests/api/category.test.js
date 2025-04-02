// const request = require('supertest')
// const axios = require('axios')

// const API_URL = 'http://localhost:1337/api'
// let jwtToken // для авторизованных запросов
// let categoryId // для хранения ID созданной категории

// // Авторизация перед всеми тестами
// beforeAll(async () => {
// 	try {
// 		const response = await axios.post(`${API_URL}/auth/local`, {
// 			identifier: 'kassen.ds@gmail.com',
// 			password: 'Lbvjy_vbccbz26',
// 		})
// 		jwtToken = response.data.jwt
// 	} catch (error) {
// 		console.error('Ошибка авторизации:', error.response?.data || error.message)
// 	}
// })

// describe('Category API', () => {
// 	// Тест на создание категории
// 	test('Должен создать новую категорию', async () => {
// 		const response = await request(API_URL)
// 			.post('/categories')
// 			.set('Authorization', `Bearer ${jwtToken}`)
// 			.send({
// 				data: {
// 					name: 'Тестовая категория',
// 					slug: 'testovaya-kategoriya',
// 					description: 'Описание тестовой категории',
// 					is_active: true,
// 				},
// 			})

// 		expect(response.status).toBe(200)
// 		expect(response.body.data).toHaveProperty('id')
// 		expect(response.body.data.attributes.name).toBe('Тестовая категория')

// 		categoryId = response.body.data.id
// 	})

// 	// Тест на получение списка категорий
// 	test('Должен вернуть список категорий', async () => {
// 		const response = await request(API_URL).get('/categories')

// 		expect(response.status).toBe(200)
// 		expect(Array.isArray(response.body.data)).toBe(true)
// 	})

// 	// Тест на получение одной категории
// 	test('Должен вернуть данные одной категории', async () => {
// 		const response = await request(API_URL).get(`/categories/${categoryId}`)

// 		expect(response.status).toBe(200)
// 		expect(response.body.data.id).toBe(categoryId)
// 		expect(response.body.data.attributes.name).toBe('Тестовая категория')
// 	})

// 	// Тест на обновление категории
// 	test('Должен обновить категорию', async () => {
// 		const response = await request(API_URL)
// 			.put(`/categories/${categoryId}`)
// 			.set('Authorization', `Bearer ${jwtToken}`)
// 			.send({
// 				data: {
// 					name: 'Обновленная категория',
// 				},
// 			})

// 		expect(response.status).toBe(200)
// 		expect(response.body.data.attributes.name).toBe('Обновленная категория')
// 	})

// 	// Тест на удаление категории
// 	test('Должен удалить категорию', async () => {
// 		const response = await request(API_URL)
// 			.delete(`/categories/${categoryId}`)
// 			.set('Authorization', `Bearer ${jwtToken}`)

// 		expect(response.status).toBe(200)

// 		// Проверка, что категория удалена
// 		const getResponse = await request(API_URL).get(`/categories/${categoryId}`)
// 		expect(getResponse.status).toBe(404)
// 	})
// })
