import SchemaOrg from '@/components/SchemaOrg'
import {
	generateProductSchema,
	generateBreadcrumbSchema,
	generateOrganizationSchema,
} from '@/lib/schema'

// async function getProductData(slug) {
// 	const apiUrl =
// 		process.env.NEXT_PUBLIC_STRAPI_API_URL || 'http://localhost:1337'
// 	const token =
// 		process.env.STRAPI_API_TOKEN ||
// 		'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzQzNjA0NzkzLCJleHAiOjE3NDYxOTY3OTN9.Y5BR-mHw3UrEpMccjIt5ojW-EtxnEnVIfW1843hmA6k'

// 	// Запрос к API Strapi для получения данных о товаре
// 	const response = await fetch(`${apiUrl}/api/study-cards/${slug}`, {
// 		headers: {
// 			Authorization: `Bearer ${token}`,
// 			'Content-Type': 'application/json',
// 		},
// 	})

// 	const data = await response.json()
// 	return data.data
// }

// export async function generateMetadata({ params }) {
// 	// В Next.js 15+ params не требует await
// 	const { slug } = params

// 	try {
// 		const product = await getProductData(slug)
// 		console.log(product)

// 		return {
// 			title: `${product.title} - Учебные карточки | mat-focus`,
// 			description: product.description || 'Учебные карточки от mat-focus',
// 			openGraph: {
// 				title: `${product.title} - Учебные карточки | mat-focus`,
// 				description: product.description || 'Учебные карточки от mat-focus',
// 				url: `https://mat-focus.ru/product/${slug}`,
// 				images:
// 					product.image?.data?.map((img) => ({
// 						url: img.url,
// 						width: img.width,
// 						height: img.height,
// 					})) || [],
// 				locale: 'ru_RU',
// 				type: 'website',
// 			},
// 		}
// 	} catch (error) {
// 		console.error('Error generating metadata:', error)
// 		return {
// 			title: 'Учебная карточка | mat-focus',
// 			description: 'Учебные карточки от mat-focus',
// 		}
// 	}
// }

// export default async function ProductPage({ params }) {
// 	// В Next.js 15+ params не требует await
// 	const { slug } = params

// 	try {
// 		const product = await getProductData(slug)

// 		// Подготовка данных для схемы
// 		const productData = {
// 			id: product.id,
// 			title: product.title,
// 			description: product.description,
// 			slug: slug,
// 			price: product.price,
// 			imageUrl: product.image?.data?.[0]?.attributes?.url,
// 			quantity: product.quantity || 0,
// 			schoolGrade: product.school_grades?.join(', '),
// 			subject: product.subject,
// 			numberOfCards: product.number_of_cards,
// 			cardType: product.card_type,
// 			publishDate: product.createdAt,
// 		}

// 		// Категория (если есть)
// 		const category = product.category?.data
// 			? {
// 					name: product.category.data.attributes.name,
// 					slug: product.category.data.attributes.slug,
// 			  }
// 			: null

// 		// Создание схем Schema.org
// 		const productSchema = generateProductSchema(productData)
// 		const breadcrumbSchema = generateBreadcrumbSchema(productData, category)
// 		const organizationSchema = generateOrganizationSchema()

// 		// Все схемы для страницы
// 		const schemas = [productSchema, breadcrumbSchema, organizationSchema]

// 		return (
// 			<>
// 				{/* Основной контент страницы */}
// 				<h1>{product.title}</h1>

// 				{/* Внедрение Schema.org */}
// 				<SchemaOrg data={schemas} />
// 			</>
// 		)
// 	} catch (error) {
// 		console.error('Error rendering product page:', error)
// 		return <div>Товар не найден или произошла ошибка при загрузке.</div>
// 	}
// }

export default function Page({ params }) {
	return (
		<div className="test-sm">Тут должна быть отдельная страница товара</div>
	)
}
