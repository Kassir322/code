// src/app/product/[slug]/page.js
import { getAllProductsServer, getProductBySlugServer } from '@/lib/next-api'
import { notFound } from 'next/navigation'
import ProductGallery from '@/components/product/ProductGallery'
import ProductInfo from '@/components/product/ProductInfo'
import ProductActions from '@/components/product/ProductActions'
import ProductTabs from '@/components/product/ProductTabs'
import ProductTrustBlock from '@/components/product/ProductTrustBlock'
import ProductFAQ from '@/components/product/ProductFAQ'
import SimilarProducts from '@/components/product/SimilarProducts'
import Breadcrumbs from '@/components/Breadcrumbs'
import SchemaOrg from '@/components/SchemaOrg'
import {
	generateProductSchema,
	generateBreadcrumbSchema,
	generateOrganizationSchema,
} from '@/lib/schema'
import PopularProducts from '@/components/product/PopularProducts'
import { ArrowLeft } from 'lucide-react'
import SmartLink from '@/components/SmartLink'
import ProductPrice from '@/components/product/ProductPrice'

export const revalidate = 20
// Генерируем статические пути для всех товаров при сборке
export async function generateStaticParams() {
	const products = await getAllProductsServer()
	const data = products.map((product) => ({
		slug: product.slug,
	}))
	return data
}

// Генерируем метаданные для страницы (SEO)
export async function generateMetadata({ params }) {
	const { slug } = await params
	const product = await getProductBySlugServer(slug)

	if (!product) {
		return {
			title: 'Товар не найден | Mat-Focus',
			description: 'К сожалению, запрашиваемый товар не найден.',
		}
	}

	return {
		title: `${product.title} | Учебные карточки Mat-Focus`,
		description:
			product.description ||
			`Учебные карточки ${product.title} от Mat-Focus для эффективного обучения и подготовки к экзаменам`,
		keywords: `учебные карточки, ${
			product.cardType?.toLowerCase() || 'обучение'
		}, Mat-Focus, образование`,
		alternates: {
			canonical: `https://mat-focus.ru/product/${slug}`,
		},
		robots: {
			index: true,
			follow: true,
		},
	}
}

// Серверная компонента для страницы товара
export default async function ProductPage({ params }) {
	const { slug } = await params

	const product = await getProductBySlugServer(slug)

	if (!product) {
		notFound()
	}

	// Формируем хлебные крошки
	const breadcrumbItems = [
		{ name: 'Главная', url: '/' },
		{ name: 'Каталог', url: '/catalog/all' },
	]

	// Добавляем категорию только если она существует
	if (product.category) {
		breadcrumbItems.push({
			name: product.category.name,
			url: `/catalog/${product.category.slug}`,
		})
	}

	// Добавляем текущий продукт
	breadcrumbItems.push({
		name: product.title,
		url: `/product/${product.slug}`,
	})

	// Создаем схемы для микроразметки
	const productSchema = generateProductSchema({
		id: product.id,
		title: product.title,
		description: product.description,
		price: product.price,
		images: product.images,
		category: product.category?.name,
		slug: product.slug,
		cardType: product.cardType,
		numberOfCards: product.numberOfCards,
		isActive: product.isActive,
	})

	const breadcrumbSchema = generateBreadcrumbSchema(
		{ ...product, slug },
		product.category
	)

	const organizationSchema = generateOrganizationSchema()
	const schemas = [productSchema, breadcrumbSchema, organizationSchema]

	// Создаем уникальный ключ, который будет меняться при изменении важных данных товара
	const productKey = `product-${product.id}-${product.price}`

	return (
		<main className="container mx-auto px-4 mt-24 mb-16">
			<Breadcrumbs items={breadcrumbItems} />
			<div className="flex justify-between items-center mb-4">
				<SmartLink
					href="/catalog/all"
					className="flex items-center text-secondary-blue hover:underline"
				>
					<ArrowLeft className="h-4 w-4 mr-1" />
					<span>Назад в каталог</span>
				</SmartLink>
			</div>
			<div className="bg-white rounded-lg shadow-sm p-6 my-8">
				<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
					<ProductGallery
						oldPrice={product.oldPrice}
						images={product.images}
						title={product.title}
					/>
					<div className="flex flex-col">
						<ProductInfo key={`info-${productKey}`} product={product} />

						<ProductActions key={`actions-${productKey}`} product={product} />
					</div>
				</div>
			</div>
			<ProductTrustBlock />
			<ProductTabs key={`tabs-${product.id}`} product={product} />
			<ProductFAQ />
			<SimilarProducts
				currentProductSlug={slug}
				categorySlug={product.category?.slug}
			/>
			<PopularProducts currentProductSlug={slug} />
			<SchemaOrg data={schemas} />
		</main>
	)
}
