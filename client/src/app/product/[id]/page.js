// src/app/product/[id]/page.js
import { getProductById } from '@/lib/api'
import { notFound } from 'next/navigation'
import ProductGallery from '@/components/product/ProductGallery'
import ProductInfo from '@/components/product/ProductInfo'
import ProductActions from '@/components/product/ProductActions'
import ProductTabs from '@/components/product/ProductTabs'
import Breadcrumbs from '@/components/Breadcrumbs'
import SchemaOrg from '@/components/SchemaOrg'
import {
	generateProductSchema,
	generateBreadcrumbSchema,
	generateOrganizationSchema,
} from '@/lib/schema'
import PopularProducts from '@/components/product/PopularProducts'

// Генерируем метаданные для страницы (для SEO)
export async function generateMetadata({ params }) {
	const { id } = await params

	try {
		const product = await getProductById(id)

		if (!product) {
			return {
				title: 'Товар не найден | Mat-Focus',
				description: 'К сожалению, запрашиваемый товар не найден.',
			}
		}

		// Формируем оптимизированные метаданные для товара
		return {
			title: `${product.name} | Учебные карточки Mat-Focus`,
			description:
				product.description ||
				`Учебные карточки ${product.name} от Mat-Focus для эффективного обучения`,
			keywords: `учебные карточки, ${
				product.subject?.toLowerCase() || 'обучение'
			}, ${product.grade || ''}, Mat-Focus`,
			// openGraph: {
			// 	title: `${product.name} | Учебные карточки Mat-Focus`,
			// 	description:
			// 		product.description ||
			// 		`Учебные карточки ${product.name} для эффективного обучения`,
			// 	url: `https://mat-focus.ru/product/${id}`,
			// 	images: [
			// 		{
			// 			url: product.imageSrc || '/images/products/card_example2.png',
			// 			width: 993,
			// 			height: 1347,
			// 			alt: product.name,
			// 		},
			// 	],
			// 	locale: 'ru_RU',
			// 	type: 'product',
			// },
			// Добавляем канонический URL для избежания дублирования контента
			alternates: {
				canonical: `https://mat-focus.ru/product/${id}`,
			},
			// Указываем, что страница доступна для индексации
			robots: {
				index: true,
				follow: true,
			},
		}
	} catch (error) {
		console.error('Ошибка при генерации метаданных:', error)
		return {
			title: 'Учебные карточки | Mat-Focus',
			description: 'Учебные карточки для эффективного обучения',
		}
	}
}

export default async function ProductPage({ params }) {
	const { id } = await params

	try {
		// Получаем данные о товаре
		const product = await getProductById(id)

		if (!product) {
			notFound() // Вызываем 404 страницу если товар не найден
		}

		// Данные для отображения хлебных крошек
		const breadcrumbItems = [
			{ name: 'Главная', url: '/' },
			{ name: 'Каталог', url: '/catalog' },
		]

		// Если есть информация о категории, добавляем её в хлебные крошки
		if (product.subject) {
			const categorySlug = product.subject
				.toLowerCase()
				.replace(/\s+/g, '-')
				.replace(/[^\w\-]+/g, '')
			breadcrumbItems.push({
				name: product.subject,
				url: `/catalog/${categorySlug}`,
			})
		}

		// Добавляем текущий товар в хлебные крошки
		breadcrumbItems.push({
			name: product.name,
			url: `/product/${id}`,
		})

		// Создаем данные схемы для микроразметки Schema.org
		const productSchema = generateProductSchema({
			...product,
			id,
			slug: id,
		})

		const breadcrumbSchema = generateBreadcrumbSchema(
			{ ...product, id, slug: id },
			product.subject
				? { name: product.subject, slug: product.subject.toLowerCase() }
				: null
		)

		const organizationSchema = generateOrganizationSchema()

		// Создаем массив схем для страницы
		const schemas = [productSchema, breadcrumbSchema, organizationSchema]

		return (
			<main className="container mx-auto px-4 mt-24 mb-16">
				{/* Хлебные крошки для навигации и SEO */}
				<Breadcrumbs items={breadcrumbItems} />

				<div className="bg-white rounded-lg shadow-sm p-6 my-8">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
						{/* Галерея изображений */}
						<ProductGallery product={product} />

						<div className="flex flex-col">
							{/* Информация о товаре */}
							<ProductInfo product={product} />

							{/* Кнопки действий (добавление в корзину и т.д.) */}
							<ProductActions product={product} />
						</div>
					</div>
				</div>

				{/* Вкладки с дополнительной информацией и отзывами */}
				<ProductTabs product={product} />

				{/* Популярные товары */}
				<PopularProducts currentProductId={id} />

				{/* Schema.org микроразметка для SEO */}
				<SchemaOrg data={schemas} />
			</main>
		)
	} catch (error) {
		console.error('Ошибка при отображении страницы товара:', error)
		notFound()
	}
}
