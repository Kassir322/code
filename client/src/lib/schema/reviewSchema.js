/**
 * Генерирует Schema.org разметку для отзывов о продукте
 * @param {Object} product - Объект с данными о продукте
 * @param {Array} reviews - Массив отзывов о продукте
 * @returns {Object} - Объект Schema.org для отзывов
 */
export function generateReviewsSchema(product, reviews) {
	return reviews.map((review) => ({
		'@context': 'https://schema.org',
		'@type': 'Review',
		itemReviewed: {
			'@type': 'Product',
			name: product.title,
			url: `https://mat-focus.ru/product/${product.slug}`,
		},
		reviewRating: {
			'@type': 'Rating',
			ratingValue: review.rating.toString(),
			bestRating: '5',
		},
		author: {
			'@type': 'Person',
			name: review.authorName || 'Пользователь mat-focus',
		},
		datePublished: review.createdAt, // Дата публикации отзыва
		reviewBody: review.comment,
	}))
}
