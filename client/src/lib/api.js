// src/lib/api.js
import productMockData from './mock-data'

/**
 * Получает все товары
 */
export async function getAllProducts() {
	// В будущем здесь будет вызов API Strapi
	// const res = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/study-cards?populate=*`)
	// const data = await res.json()
	// return data.data

	// Пока возвращаем моковые данные
	return productMockData
}

/**
 * Получает товары по категории
 */
export async function getProductsByCategory(categorySlug) {
	// В будущем здесь будет вызов API Strapi
	// const res = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/study-cards?filters[category][slug]=${categorySlug}&populate=*`)
	// const data = await res.json()
	// return data.data

	// Пока фильтруем моковые данные
	const subjectMap = {
		mathematics: ['математика', 'алгебра'],
		'russian-language': ['русский язык'],
		physics: ['физика'],
		chemistry: ['химия'],
		biology: ['биология'],
		history: ['история'],
		'social-science': ['обществознание'],
		'english-language': ['английский язык'],
		literature: ['литература'],
		geography: ['география'],
		informatics: ['информатика'],
		geometry: ['геометрия'],
	}

	const subjects = subjectMap[categorySlug] || []
	return productMockData.filter((product) =>
		subjects.includes(product.subject.toLowerCase())
	)
}

/**
 * Получает информацию о товаре по ID
 */
export async function getProductById(productId) {
	// В будущем здесь будет вызов API Strapi
	// const res = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/study-cards/${productId}?populate=*`)
	// const data = await res.json()
	// return data.data

	// Пока находим в моковых данных
	return productMockData.find(
		(product) => product.id.toString() === productId.toString()
	)
}
