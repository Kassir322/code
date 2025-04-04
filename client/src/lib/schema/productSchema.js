/**
 * Генерирует Schema.org разметку для страницы продукта учебных карточек
 * @param {Object} product - Объект с данными о продукте
 * @returns {Object} - Объект Schema.org для продукта
 */
export function generateProductSchema(product) {
	return {
		'@context': 'https://schema.org',
		'@type': 'Product',
		name: product.title,
		description: product.description,
		image: product.imageUrl, // URL изображения товара
		url: `https://mat-focus.ru/product/${product.slug}`,
		sku: product.id.toString(), // Используем ID в качестве SKU
		brand: {
			'@type': 'Brand',
			name: 'mat-focus',
		},
		offers: {
			'@type': 'Offer',
			url: `https://mat-focus.ru/product/${product.slug}`,
			priceCurrency: 'RUB',
			price: product.price.toString(),
			availability:
				product.quantity > 0
					? 'https://schema.org/InStock'
					: 'https://schema.org/OutOfStock',
			seller: {
				'@type': 'Organization',
				name: 'mat-focus',
			},
			itemCondition: 'https://schema.org/NewCondition',
			priceValidUntil: getNextYearDate(), // Функция для генерации даты +1 год от текущей
		},
		// Если у товара есть отзывы и рейтинг
		...(product.rating && {
			aggregateRating: {
				'@type': 'AggregateRating',
				ratingValue: product.rating.toString(),
				reviewCount: product.reviewCount.toString(),
			},
		}),
		// Дополнительные параметры для учебных материалов
		additionalProperty: [
			{
				'@type': 'PropertyValue',
				name: 'Класс',
				value: product.schoolGrade,
			},
			{
				'@type': 'PropertyValue',
				name: 'Предмет',
				value: product.subject,
			},
			{
				'@type': 'PropertyValue',
				name: 'Количество карточек',
				value: product.numberOfCards.toString(),
			},
			{
				'@type': 'PropertyValue',
				name: 'Формат',
				value: product.cardType,
			},
		],
		// Если есть дата публикации
		...(product.publishDate && {
			datePublished: product.publishDate,
		}),
	}
}

/**
 * Вспомогательная функция для получения даты через год от текущей
 * @returns {string} - Дата в формате ISO
 */
function getNextYearDate() {
	const date = new Date()
	date.setFullYear(date.getFullYear() + 1)
	return date.toISOString().split('T')[0]
}
