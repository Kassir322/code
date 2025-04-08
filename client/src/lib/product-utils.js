// src/lib/product-utils.js

/**
 * Фильтрует список товаров по заданным критериям
 */
export function filterProducts(products, filters) {
	return products.filter((product) => {
		// Фильтр по предмету (категории)
		if (
			filters.subject !== 'catalog' &&
			product.subject.toLowerCase() !== filters.subject.toLowerCase() &&
			!mapCategoryToSubjects(filters.subject).includes(
				product.subject.toLowerCase()
			)
		) {
			return false
		}

		// Фильтр по классу
		if (filters.grade !== 'Все классы' && product.grade !== filters.grade) {
			return false
		}

		// Фильтр по типу карточек
		if (
			filters.cardType !== 'Все типы' &&
			product.cardType !== filters.cardType
		) {
			return false
		}

		// Фильтр по цене
		if (filters.priceRange !== 'all') {
			const priceRange = getPriceRangeById(filters.priceRange)
			if (
				priceRange &&
				(product.price < priceRange.min || product.price > priceRange.max)
			) {
				return false
			}
		}

		// Фильтр по скидке
		if (filters.showDiscount && !product.oldPrice) {
			return false
		}

		return true
	})
}

/**
 * Сортирует список товаров по заданному критерию
 */
export function sortProducts(products, sortBy) {
	return [...products].sort((a, b) => {
		switch (sortBy) {
			case 'price_asc':
				return a.price - b.price
			case 'price_desc':
				return b.price - a.price
			case 'rating':
				return b.rating - a.rating
			case 'newest':
				return (b.label === 'Новинка' ? 1 : 0) - (a.label === 'Новинка' ? 1 : 0)
			case 'popular':
			default:
				return b.reviewCount - a.reviewCount
		}
	})
}

/**
 * Вспомогательная функция для сопоставления URL категории с темами предметов
 */
function mapCategoryToSubjects(categorySlug) {
	const categoryMap = {
		mathematics: ['математика', 'алгебра', 'геометрия'],
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

	return categoryMap[categorySlug] || []
}

/**
 * Возвращает диапазон цен по идентификатору
 */
function getPriceRangeById(rangeId) {
	const priceRanges = {
		all: { min: 0, max: Infinity },
		range1: { min: 0, max: 800 },
		range2: { min: 800, max: 900 },
		range3: { min: 900, max: 1000 },
		range4: { min: 1000, max: Infinity },
	}

	return priceRanges[rangeId]
}
