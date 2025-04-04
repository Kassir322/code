// Импорт всех схем
import { generateProductSchema } from './productSchema'
import { generateReviewsSchema } from './reviewSchema'
import { generateBreadcrumbSchema } from './breadcrumbSchema'
import { generateOrganizationSchema } from './organizationSchema'

// Реэкспорт для удобного импорта
export {
	generateProductSchema,
	generateReviewsSchema,
	generateBreadcrumbSchema,
	generateOrganizationSchema,
}

/**
 * Вспомогательная функция для получения даты через год от текущей
 * @returns {string} - Дата в формате ISO
 */
export function getNextYearDate() {
	const date = new Date()
	date.setFullYear(date.getFullYear() + 1)
	return date.toISOString().split('T')[0]
}

/**
 * Генерирует полный набор схем для страницы продукта
 * @param {Object} product - Данные о продукте
 * @param {Array} reviews - Отзывы о продукте
 * @param {Object} category - Категория продукта
 * @returns {Array} - Массив объектов Schema.org для страницы продукта
 */
export function generateProductPageSchemas(
	product,
	reviews = [],
	category = null
) {
	const productSchema = generateProductSchema(product)
	const reviewsSchema =
		reviews.length > 0 ? generateReviewsSchema(product, reviews) : []
	const breadcrumbSchema = generateBreadcrumbSchema(product, category)
	const organizationSchema = generateOrganizationSchema()

	return [productSchema, ...reviewsSchema, breadcrumbSchema, organizationSchema]
}
