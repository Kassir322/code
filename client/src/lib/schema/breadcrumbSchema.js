/**
 * Генерирует Schema.org разметку для хлебных крошек
 * @param {Object} product - Объект с данными о продукте
 * @param {Object} category - Объект с данными о категории
 * @returns {Object} - Объект Schema.org для хлебных крошек
 */
export function generateBreadcrumbSchema(product, category) {
	const breadcrumbItems = [
		{
			name: 'Главная',
			url: 'https://mat-focus.ru/',
		},
	]

	// Добавляем категорию, если она есть
	if (category) {
		breadcrumbItems.push({
			name: category.name,
			url: `https://mat-focus.ru/catalog/${category.slug}`,
		})
	}

	// Добавляем текущий товар
	breadcrumbItems.push({
		name: product.title,
		url: `https://mat-focus.ru/product/${product.slug}`,
	})

	return {
		'@context': 'https://schema.org',
		'@type': 'BreadcrumbList',
		itemListElement: breadcrumbItems.map((item, index) => ({
			'@type': 'ListItem',
			position: index + 1,
			name: item.name,
			item: item.url,
		})),
	}
}
