// src/app/product/[slug]/page.js
import { getAllProducts } from '@/lib/api'
import { notFound } from 'next/navigation'
import ProductGallery from '@/components/product/ProductGallery'
import ProductInfo from '@/components/product/ProductInfo'
import ProductActions from '@/components/product/ProductActions'
import ProductTabs from '@/components/product/ProductTabs'
import ProductTrustBlock from '@/components/product/ProductTrustBlock'
import ProductFAQ from '@/components/product/ProductFAQ' // Импортируем новый компонент FAQ
import SimilarProducts from '@/components/product/SimilarProducts' // Импортируем новый компонент похожих товаров
import Breadcrumbs from '@/components/Breadcrumbs'
import SchemaOrg from '@/components/SchemaOrg'
import {
	generateProductSchema,
	generateBreadcrumbSchema,
	generateOrganizationSchema,
} from '@/lib/schema'
import PopularProducts from '@/components/product/PopularProducts'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

// Импортируем функцию для поиска товара по slug из API
import { getProductBySlug } from '@/lib/api'

// Генерируем метаданные для страницы (для SEO)
export async function generateMetadata({ params }) {
	const { slug } = await params

	try {
		const product = await getProductBySlug(slug)

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
				`Учебные карточки ${product.name} от Mat-Focus для эффективного обучения и подготовки к экзаменам`,
			keywords: `учебные карточки, ${
				product.subject?.toLowerCase() || 'обучение'
			}, ${product.grade || ''}, Mat-Focus, образование`,
			// OpenGraph для лучшего отображения при шеринге в соцсетях
			// openGraph: {
			// 	title: `${product.name} | Учебные карточки Mat-Focus`,
			// 	description:
			// 		product.description ||
			// 		`Учебные карточки ${product.name} для эффективного обучения и подготовки к экзаменам`,
			// 	url: `https://mat-focus.ru/product/${slug}`,
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
				canonical: `https://mat-focus.ru/product/${slug}`,
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
	const { slug } = await params

	try {
		// Получаем данные о товаре
		const product = await getProductBySlug(slug)

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
			url: `/product/${slug}`,
		})

		// Создаем данные схемы для микроразметки Schema.org
		const productSchema = generateProductSchema({
			...product,
			slug,
		})

		const breadcrumbSchema = generateBreadcrumbSchema(
			{ ...product, slug },
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

				<div className="flex justify-between items-center mb-4">
					<Link
						href="/catalog"
						className="flex items-center text-secondary-blue hover:underline"
					>
						<ArrowLeft className="h-4 w-4 mr-1" />
						<span>Назад в каталог</span>
					</Link>
				</div>

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

				{/* Блок "Почему стоит купить у нас" */}
				<ProductTrustBlock />

				{/* Вкладки с дополнительной информацией и отзывами */}
				<ProductTabs product={product} />

				{/* Новый раздел FAQ */}
				<ProductFAQ />

				{/* Похожие товары из той же категории */}
				<SimilarProducts currentProductSlug={slug} category={product.subject} />

				{/* Популярные товары */}
				<PopularProducts currentProductSlug={slug} />

				{/* Schema.org микроразметка для SEO */}
				<SchemaOrg data={schemas} />
			</main>
		)
	} catch (error) {
		console.error('Ошибка при отображении страницы товара:', error)
		notFound()
	}
}
