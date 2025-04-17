/**
 * Получает заголовки для серверных запросов к API
 * Использует API ключ вместо токена авторизации
 * @returns {Object} Объект с заголовками
 */
function getServerHeaders() {
	return {
		'Content-Type': 'application/json',
		Authorization: `Bearer ${process.env.STRAPI_API_KEY}`,
	}
}

/**
 * Получает все товары (серверная версия)
 * Используется для generateStaticParams и других серверных функций
 * @returns {Promise<Array>} Массив товаров
 */
export async function getAllProductsServer() {
	const res = await fetch(
		`${process.env.STRAPI_API_URL}/api/study-cards?populate=*`,
		{
			headers: getServerHeaders(),
			cache: 'force-cache',
		}
	)

	if (!res.ok) {
		throw new Error('Ошибка при получении товаров')
	}

	const data = await res.json()
	return data.data.map(transformStrapiResponse)
}

/**
 * Получает товар по slug (серверная версия)
 * @param {string} slug - Slug товара
 * @returns {Promise<Object|null>} Данные товара или null
 */
export async function getProductBySlugServer(slug) {
	// /api/study-cards?populate=*&filters[category][slug][$eq]=${categorySlug}
	const res = await fetch(
		`${process.env.STRAPI_API_URL}/api/study-cards?populate=*&filters[slug]=${slug}`,
		{
			headers: getServerHeaders(),
			cache: 'force-cache',
		}
	)

	if (!res.ok) {
		throw new Error('Ошибка при получении товара')
	}

	const data = await res.json()
	return data.data[0] ? transformStrapiResponse(data.data[0]) : null
}

/**
 * Получает все категории (серверная версия)
 * @returns {Promise<Array>} Массив категорий
 */
export async function getAllCategoriesServer() {
	const res = await fetch(
		`${process.env.STRAPI_API_URL}/api/categories?populate=*`,
		{
			headers: getServerHeaders(),
			cache: 'force-cache',
		}
	)

	if (!res.ok) {
		throw new Error('Ошибка при получении категорий')
	}

	const data = await res.json()
	return data.data.map(transformCategoryResponse)
}

/**
 * Трансформирует ответ от Strapi в формат, ожидаемый фронтендом
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

	// console.log('strapiItem', {
	// 	id,
	// 	title,
	// 	description,
	// 	price,
	// 	quantity,
	// 	number_of_cards,
	// 	subject,
	// 	card_type,
	// 	is_active,
	// 	slug,
	// 	image,
	// 	category,
	// 	grades,
	// })
	const obj = {
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
				url: img.url,
				alt: img.alternativeText || title,
			})) || [],
		category: category
			? {
					name: category.name,
					slug: category.slug,
			  }
			: null,
		// grade: grade ? grade.name : null,
		grades:
			grades?.map((grade) => ({
				displayName: grade.display_name,
			})) || [],
	}

	console.log(`obj: ${JSON.stringify(obj)}`)

	return obj
}

/**
 * Трансформирует ответ категории от Strapi
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
