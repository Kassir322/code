// src/app/catalog/[slug]/page.js
import CatalogView from '@/components/catalog/CatalogView'
import { getSeoTextForCategory } from '@/lib/seo-helpers'
import { getProductsByCategory, getAllProducts } from '@/lib/api'
import Breadcrumbs from '@/components/Breadcrumbs'
import {
	getAllCategoriesServer,
	getGradesWithCardsServer,
} from '@/lib/next-api'

export const revalidate = 3600 // 1 час
export const dynamic = 'force-static'

// Экспортируем данные категорий для использования в компоненте
export async function getCategories() {
	const categories = await getAllCategoriesServer()
	return categories
}

// Экспортируем данные классов для использования в компоненте
export async function getGrades() {
	const grades = await getGradesWithCardsServer()
	return grades
}

export async function generateStaticParams() {
	const categories = await getCategories()
	const data = categories.map((cat) => ({
		slug: cat.slug,
	}))
	// Добавляем 'all' для главной страницы каталога
	data.push({ slug: 'all' })
	return data
}

export async function generateMetadata({ params }) {
	const { slug } = await params
	const categorySlug = slug || 'all'
	const seoText = getSeoTextForCategory(categorySlug)

	return {
		title: seoText.title,
		description: seoText.description,
	}
}

export default async function CatalogPage({ params, searchParams }) {
	const { slug } = await params
	const categorySlug = slug || 'all'
	const search_Params = await searchParams

	// Получаем все категории и находим текущую
	const categories = await getCategories()
	const currentCategory = categories.find((cat) => cat.slug === categorySlug)

	// Получаем все классы
	const grades = await getGrades()

	// Получаем данные о категории и товарах
	const products =
		categorySlug === 'all'
			? await getAllProducts()
			: await getProductsByCategory(categorySlug)

	// Получаем SEO текст для данной категории
	const seoText = getSeoTextForCategory(categorySlug)

	// Формируем хлебные крошки
	const breadcrumbItems = [
		{ name: 'Главная', url: '/' },
		{ name: 'Каталог', url: '/catalog/all' },
	]

	if (categorySlug !== 'all' && currentCategory) {
		breadcrumbItems.push({
			name: currentCategory.name,
			url: `/catalog/${categorySlug}`,
		})
	}
	console.log(`grades`, grades)
	// Получаем параметры запроса для начальной фильтрации
	const initialSort = search_Params.sort || 'popular'
	const initialPage = parseInt(await search_Params.page) || 1

	return (
		<div className="container mx-auto px-4 mt-24 mb-16">
			{/* SEO блок с заголовком и описанием */}
			<section className="mb-8">
				<h1 className="text-3xl font-bold mb-4">{seoText.title}</h1>
				<div className="bg-white p-6 rounded-lg shadow-sm">
					<p className="text-gray-700">{seoText.description}</p>
				</div>
			</section>

			{/* Хлебные крошки */}
			<Breadcrumbs items={breadcrumbItems} />

			{/* Основной компонент каталога (клиентский) */}
			<CatalogView
				products={products}
				categories={categories}
				categorySlug={categorySlug}
				initialSort={initialSort}
				initialPage={initialPage}
				grades={grades}
			/>
		</div>
	)
}
