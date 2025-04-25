// src/lib/product-utils.js

/**
 * Проверяет, входит ли класс в диапазон
 * @param {string} productGrade - Класс товара
 * @param {string} selectedGrade - Выбранный диапазон классов
 * @returns {boolean}
 */
function isGradeInRange(productGrade, selectedGrade) {
	if (selectedGrade === 'Все классы') return true

	const gradeRanges = {
		'5-6 класс': ['5', '6'],
		'7-8 класс': ['7', '8'],
		'8-9 класс': ['8', '9'],
		'9 класс (ОГЭ)': ['9'],
		'10-11 класс': ['10', '11'],
		'11 класс (ЕГЭ)': ['11'],
	}

	const range = gradeRanges[selectedGrade]
	if (!range) return false

	// Проверяем, входит ли класс товара в выбранный диапазон
	return range.includes(productGrade)
}

/**
 * Фильтрует список товаров по заданным критериям
 * @param {Array} products - Список товаров
 * @param {Object} filters - Объект с параметрами фильтрации
 * @returns {Array} Отфильтрованный список товаров
 */
export function filterProducts(products, filters) {
	return products.filter((product) => {
		// Фильтр по классу
		if (
			filters.grades &&
			filters.grades.length > 0 &&
			!filters.grades.includes('all')
		) {
			const productGrades = product.grades.map((grade) => grade.displayName)
			if (!filters.grades.some((grade) => productGrades.includes(grade))) {
				return false
			}
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
			if (!priceRange) return false

			const productPrice = product.oldPrice || product.price
			if (productPrice < priceRange.min || productPrice > priceRange.max) {
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
 * @param {Array} products - Список товаров
 * @param {string} sortBy - Критерий сортировки
 * @returns {Array} Отсортированный список товаров
 */
export function sortProducts(products, sortBy) {
	return [...products].sort((a, b) => {
		switch (sortBy) {
			case 'price_asc':
				return (a.oldPrice || a.price) - (b.oldPrice || b.price)
			case 'price_desc':
				return (b.oldPrice || b.price) - (a.oldPrice || a.price)
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
// function mapCategoryToSubjects(categorySlug) {
// 	const categoryMap = {
// 		mathematics: ['математика', 'алгебра', 'геометрия'],
// 		'russian-language': ['русский язык'],
// 		physics: ['физика'],
// 		chemistry: ['химия'],
// 		biology: ['биология'],
// 		history: ['история'],
// 		'social-science': ['обществознание'],
// 		'english-language': ['английский язык'],
// 		literature: ['литература'],
// 		geography: ['география'],
// 		informatics: ['информатика'],
// 		geometry: ['геометрия'],
// 	}

// 	return categoryMap[categorySlug] || []
// }

/**
 * Возвращает диапазон цен по идентификатору
 * @param {string} rangeId - Идентификатор диапазона цен
 * @returns {Object|null} Объект с минимальной и максимальной ценой
 */
function getPriceRangeById(rangeId) {
	const priceRanges = {
		all: { min: 0, max: Infinity },
		range1: { min: 0, max: 400 },
		range2: { min: 400, max: 600 },
		range3: { min: 600, max: 800 },
		range4: { min: 800, max: Infinity },
	}

	return priceRanges[rangeId] || null
}
