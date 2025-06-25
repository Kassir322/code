// src/lib/api.js

import cookiesService from '@/services/cookies'

/**
 * Получает заголовки для запросов к API
 * @returns {Object} Объект с заголовками
 */
async function getHeaders() {
	const headers = {
		'Content-Type': 'application/json',
	}

	const token = cookiesService.getAuthToken()

	if (token) {
		headers.Authorization = `Bearer ${token}`
	}

	return headers
}

/**
 * Получает все товары
 * @returns {Promise<Array>} Массив товаров с их данными
 */
export async function getAllProducts() {
	const res = await fetch(
		`${process.env.NEXT_PUBLIC_API_URL}/api/study-cards?populate=*`,
		{
			headers: await getHeaders(),
			cache: 'force-cache',
			next: { revalidate: 3600 },
		}
	)
	if (!res.ok) {
		return []
	}

	const data = await res.json()

	return data.data.map(transformStrapiResponse)
}

// /api/restaurants?filters[id][$in][0]=6&filters[id][$in][1]=8
// /api/study-cards?filters[category][%eq]=matematika

/**
 * Получает товары по категории
 * @param {string} categorySlug - Slug категории
 * @returns {Promise<Array>} Отфильтрованный массив товаров
 */
export async function getProductsByCategory(categorySlug) {
	const res = await fetch(
		`${process.env.NEXT_PUBLIC_API_URL}/api/study-cards?populate=*&filters[category][slug][$eq]=${categorySlug}`,
		{
			headers: await getHeaders(),
			cache: 'force-cache',
			next: {
				revalidate: 3600, // Кэшируем на 1 час
				tags: ['products', `category-${categorySlug}`], // Добавляем теги для ревалидации
			},
		}
	)

	if (!res.ok) {
		return []
	}

	const data = await res.json()
	return data.data.map(transformStrapiResponse)
}

/**
 * Получает информацию о товаре по ID
 * @deprecated Используйте getProductBySlug вместо этого метода
 */
export async function getProductById(productId) {
	// В будущем здесь будет вызов API Strapi
	// const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/study-cards/${productId}?populate=*`)
	// const data = await res.json()
	// return data.data

	// Пока находим в моковых данных
	return productMockData.find(
		(product) => product.id.toString() === productId.toString()
	)
}

/**
 * Получает информацию о товаре по Slug
 * @param {string} slug - Slug товара
 * @returns {Promise<Object|null>} Данные товара или null
 */
export async function getProductBySlug(slug) {
	const res = await fetch(
		`${process.env.NEXT_PUBLIC_API_URL}/api/study-cards?filters[slug]=${slug}&populate=*`,
		{
			headers: await getHeaders(),
			cache: 'force-cache',
			next: { revalidate: 3600 },
		}
	)

	if (!res.ok) {
		return []
	}

	const data = await res.json()
	return data.data[0] ? transformStrapiResponse(data.data[0]) : null
}

/**
 * Трансформирует ответ от Strapi в формат, ожидаемый фронтендом
 * @param {Object} strapiItem - Элемент из ответа Strapi
 * @returns {Object} Трансформированный объект
 */
function transformStrapiResponse(strapiItem) {
	const {
		id,
		title,
		description,
		price,
		quantity,
		number_of_cards,
		subject,
		card_type,
		is_active,
		slug,
		image,
		category,
		grades,
	} = strapiItem

	return {
		id,
		title,
		description,
		price: Number(price),
		quantity: quantity || 0,
		numberOfCards: number_of_cards,
		subject,
		cardType: card_type,
		isActive: is_active,
		slug,
		images:
			image?.data?.map((img) => ({
				url: img.attributes.url,
				alt: img.attributes.alternativeText || title,
			})) || [],
		category: category?.data
			? {
					id: category.data.id,
					...category.data.attributes,
			  }
			: null,
		grades:
			grades?.map((grade) => ({
				displayName: grade.display_name,
			})) || [],
	}
}

/**
 * Получает три самых дешёвых товара для featured секции
 * @param {number} count - Количество товаров
 * @returns {Promise<Array>} Массив из трёх товаров
 */
export async function getFeaturedProducts(count = 3) {
	const res = await fetch(
		`${process.env.NEXT_PUBLIC_API_URL}/api/study-cards?populate=*&sort=price:asc&pagination[pageSize]=${count}`,
		{
			cache: 'force-cache',
			next: { revalidate: 3600 },
		}
	)

	console.log(res)

	if (!res.ok) {
		return []
	}

	const data = await res.json()
	return data.data.map(transformStrapiResponse)
}

/**
 * Получает все категории
 * @returns {Promise<Array>} Массив категорий
 */
export async function getAllCategories() {
	const res = await fetch(
		`${process.env.NEXT_PUBLIC_API_URL}/api/categories?populate=*`,
		{
			headers: await getHeaders(),
			cache: 'force-cache',
			next: { revalidate: 3600 },
		}
	)

	if (!res.ok) {
		return []
	}

	const data = await res.json()
	return data.data.map(transformCategoryResponse)
}

/**
 * Трансформирует ответ категории от Strapi
 * @param {Object} categoryItem - Элемент категории из ответа Strapi
 * @returns {Object} Трансформированный объект категории
 */
function transformCategoryResponse(categoryItem) {
	const { id, name, slug, description, is_active } = categoryItem
	return {
		id,
		name,
		slug,
		description,
		isActive: is_active,
	}
}

/**
 * Получает заказы пользователя
 * @param {string} userId - ID пользователя
 * @returns {Promise<Array>} Массив заказов
 */
export async function getUserOrders(userId) {
	const res = await fetch(
		`${process.env.NEXT_PUBLIC_API_URL}/api/orders/me?populate=*`,
		{
			headers: await getHeaders(),
			cache: 'no-store',
		}
	)

	if (!res.ok) {
		return []
	}

	const data = await res.json()
	return data.data.map(transformOrderResponse)
}

/**
 * Трансформирует ответ заказа от Strapi
 * @param {Object} orderItem - Элемент заказа из ответа Strapi
 * @returns {Object} Трансформированный объект заказа
 */
function transformOrderResponse(orderItem) {
	const {
		id,
		total_amount,
		order_status,
		payment_method,
		shipping_method,
		tracking_number,
		notes,
		createdAt,
		updatedAt,
		order_items,
		shipping_address,
		payment,
	} = orderItem

	return {
		id,
		totalAmount: Number(total_amount),
		orderStatus: order_status,
		paymentMethod: payment_method,
		shippingMethod: shipping_method,
		trackingNumber: tracking_number,
		notes,
		createdAt,
		updatedAt,
		orderItems:
			order_items?.map((item) => ({
				id: item.id,
				quantity: item.quantity,
				price: Number(item.price),
				title: item.study_card.title,
			})) || [],
		shippingAddress: shipping_address,
		payment: payment?.data
			? {
					id: payment.data.id,
					...payment.data.attributes,
			  }
			: null,
	}
}

/**
 * Получает список классов с сортировкой по полю order
 * @returns {Promise<Array>} Список классов
 */
export async function getGrades() {
	try {
		const response = await fetch(
			`${process.env.NEXT_PUBLIC_API_URL}/api/grades?sort=order:asc`
		)
		const data = await response.json()
		return data.data
	} catch (error) {
		console.error('Error fetching grades:', error)
		return []
	}
}

/**
 * Получает список классов, которые имеют связь с карточками
 * @returns {Promise<Array>} Список классов с карточками
 */
export async function getGradesWithCards() {
	try {
		const response = await fetch(
			`${process.env.NEXT_PUBLIC_API_URL}/api/grades?populate=study_cards&sort=order:asc`,
			{
				headers: await getHeaders(),
				cache: 'force-cache',
				next: {
					revalidate: 20, // Кэшируем на 1 час
					tags: ['grades'], // Добавляем тег для ревалидации
				},
			}
		)
		const data = await response.json()

		// Фильтруем только те классы, у которых есть связанные карточки
		return data.data.filter((grade) => grade.study_cards.length > 0)
	} catch (error) {
		console.error('Error fetching grades with cards:', error)
		return []
	}
}

/**
 * Получает похожие товары из той же категории или того же класса
 * @param {string} categorySlug - Slug категории
 * @param {string} currentProductSlug - Slug текущего товара
 * @param {Array} grades - Массив классов текущего товара
 * @param {number} count - Количество товаров
 * @returns {Promise<Array>} Массив похожих товаров
 */
export async function getSimilarProducts(
	categorySlug,
	currentProductSlug,
	grades = [],
	count = 4
) {
	// Получаем товары из той же категории
	const categoryRes = await fetch(
		`${process.env.NEXT_PUBLIC_API_URL}/api/study-cards?populate=*&filters[category][slug][$eq]=${categorySlug}&filters[slug][$ne]=${currentProductSlug}&pagination[pageSize]=${count}`,
		{
			headers: await getHeaders(),
			cache: 'force-cache',
			next: { revalidate: 3600 },
		}
	)

	if (!categoryRes.ok) {
		return []
	}

	const categoryData = await categoryRes.json()
	const categoryProducts = categoryData.data.map(transformStrapiResponse)

	// Если нашли достаточно товаров из той же категории, возвращаем их
	if (categoryProducts.length >= count) {
		return categoryProducts.slice(0, count)
	}

	// Если товаров из категории недостаточно, получаем товары из того же класса
	const gradeSlugs = grades.map((grade) => grade.displayName)
	const gradeFilter = gradeSlugs
		.map((slug) => `filters[grades][display_name][$eq]=${slug}`)
		.join('&')

	const gradeRes = await fetch(
		`${
			process.env.NEXT_PUBLIC_API_URL
		}/api/study-cards?populate=*&filters[slug][$ne]=${currentProductSlug}&${gradeFilter}&pagination[pageSize]=${
			count - categoryProducts.length
		}`,
		{
			headers: await getHeaders(),
			cache: 'force-cache',
			next: { revalidate: 3600 },
		}
	)

	if (!gradeRes.ok) {
		throw new Error('Ошибка при получении товаров из того же класса')
	}

	const gradeData = await gradeRes.json()
	const gradeProducts = gradeData.data.map(transformStrapiResponse)

	// Объединяем результаты, исключая дубликаты
	const allProducts = [...categoryProducts]
	gradeProducts.forEach((product) => {
		if (!allProducts.find((p) => p.id === product.id)) {
			allProducts.push(product)
		}
	})

	return allProducts.slice(0, count)
}
