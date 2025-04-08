// src/lib/metadata.js
import { getSeoTextForCategory } from './seo-helpers'

/**
 * Генерирует метаданные для страницы каталога в зависимости от категории
 */
export function generateMetadata({ categorySlug, title, description }) {
	const seoText = getSeoTextForCategory(categorySlug)

	return {
		title: title || seoText.title,
		description: description || seoText.description,
		openGraph: {
			title: title || seoText.title,
			description: description || seoText.description,
			type: 'website',
			url: `https://mat-focus.ru/catalog/${
				categorySlug !== 'catalog' ? categorySlug : ''
			}`,
			images: [
				{
					url: 'https://mat-focus.ru/images/og-catalog.jpg',
					width: 1200,
					height: 630,
					alt: `Каталог учебных материалов - ${seoText.title}`,
				},
			],
			locale: 'ru_RU',
		},
		alternates: {
			canonical: `https://mat-focus.ru/catalog/${
				categorySlug !== 'catalog' ? categorySlug : ''
			}`,
		},
		robots: {
			index: true,
			follow: true,
		},
	}
}
