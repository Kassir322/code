// src/lib/api.js
import { cookies } from 'next/headers'

/**
 * Получает заголовки для запросов к API
 * @returns {Object} Объект с заголовками
 */
async function getHeaders() {
	const headers = {
		'Content-Type': 'application/json',
	}

	const cookieStore = await cookies()

	const token = cookieStore.get('token')?.value

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
		`${process.env.NEXT_PUBLIC_API_URL}/api/study-cards`,
		{
			headers: await getHeaders(),
			cache: 'no-store', // Отключаем кэширование для получения актуальных данных
		}
	)
	if (!res.ok) {
		throw new Error('Ошибка при получении товаров')
	}

	const data = await res.json()
	console.log(`DATA OF ALL PRODUCTS`, data)

	return data.data.map(transformStrapiResponse)
}

/**
 * Получает товары по категории
 * @param {string} categorySlug - Slug категории
 * @returns {Promise<Array>} Отфильтрованный массив товаров
 */
export async function getProductsByCategory(categorySlug) {
	const res = await fetch(
		`${process.env.NEXT_PUBLIC_API_URL}/api/study-cards?filters[category][slug]=${categorySlug}&populate=*`,
		{
			headers: await getHeaders(),
			cache: 'no-store',
		}
	)

	if (!res.ok) {
		throw new Error('Ошибка при получении товаров категории')
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
			cache: 'no-store',
		}
	)

	if (!res.ok) {
		throw new Error('Ошибка при получении товара')
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
	} = strapiItem
	console.log(`STRAPI ITEM`, strapiItem)

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
	}
}
