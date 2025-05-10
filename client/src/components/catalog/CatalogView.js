// src/components/catalog/CatalogView.js (обновленная версия)
'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import ProductCard from '@/components/ProductCard'
import ProductListItem from '@/components/ProductListItem'
import FiltersPanel from '@/components/catalog/FiltersPanel'
import SortingBar from '@/components/catalog/SortingBar'
import Pagination from '@/components/catalog/Pagination'
import { filterProducts, sortProducts } from '@/lib/product-utils'
import { getGradesWithCards } from '@/lib/api'
import SchemaOrg from '@/components/SchemaOrg'

export default function CatalogView({
	products,
	categories,
	categorySlug,
	initialSort = 'popular',
	initialPage = 1,
	grades,
}) {
	const router = useRouter()
	const pathname = usePathname()
	const searchParams = useSearchParams()

	// Состояния для фильтров
	const [selectedGrades, setSelectedGrades] = useState([])
	const [selectedCardType, setSelectedCardType] = useState('Все типы')
	const [selectedPriceRange, setSelectedPriceRange] = useState('all')
	const [showDiscount, setShowDiscount] = useState(false)
	const [sortBy, setSortBy] = useState(initialSort)
	const [currentPage, setCurrentPage] = useState(initialPage)
	const [showMobileFilter, setShowMobileFilter] = useState(false)
	const [viewMode, setViewMode] = useState('grid')
	// const [grades, setGrades] = useState([])
	const [isLoading, setIsLoading] = useState(true)

	// Загрузка классов из API
	// useEffect(() => {
	// 	const loadGrades = async () => {
	// 		setIsLoading(true)
	// 		try {
	// 			const gradesData = await getGradesWithCards()
	// 			setGrades(gradesData)
	// 		} catch (error) {
	// 			console.error('Error loading grades:', error)
	// 		} finally {
	// 			setIsLoading(false)
	// 		}
	// 	}

	// 	loadGrades()
	// }, [])

	// Количество продуктов на странице
	const productsPerPage = viewMode === 'grid' ? 9 : 5

	// Инициализация фильтров из URL
	useEffect(() => {
		const gradesParam = searchParams.get('grades')
		if (gradesParam) {
			setSelectedGrades(gradesParam.split(','))
		} else {
			setSelectedGrades(['all'])
		}

		const cardTypeParam = searchParams.get('cardType')
		if (cardTypeParam) {
			setSelectedCardType(cardTypeParam)
		}

		const priceRangeParam = searchParams.get('priceRange')
		if (priceRangeParam) {
			setSelectedPriceRange(priceRangeParam)
		}

		const discountParam = searchParams.get('discount')
		if (discountParam) {
			setShowDiscount(discountParam === 'true')
		}

		const sortParam = searchParams.get('sort')
		if (sortParam) {
			setSortBy(sortParam)
		}

		const pageParam = searchParams.get('page')
		if (pageParam) {
			setCurrentPage(parseInt(pageParam))
		}

		const viewParam = searchParams.get('view')
		if (viewParam) {
			setViewMode(viewParam)
		}
	}, [searchParams, pathname])

	// Применяем фильтры к продуктам
	const filteredProducts = filterProducts(products, {
		grades: selectedGrades,
		cardType: selectedCardType,
		priceRange: selectedPriceRange,
		showDiscount,
	})

	// Сортируем отфильтрованные продукты
	const sortedProducts = sortProducts(filteredProducts, sortBy)

	// Пагинация
	const totalPages = Math.ceil(sortedProducts.length / productsPerPage)
	const indexOfLastProduct = currentPage * productsPerPage
	const indexOfFirstProduct = indexOfLastProduct - productsPerPage
	const currentProducts = sortedProducts.slice(
		indexOfFirstProduct,
		indexOfLastProduct
	)

	// Сбросить фильтры
	const resetFilters = () => {
		setSelectedGrades(['all'])
		setSelectedCardType('Все типы')
		setSelectedPriceRange('all')
		setShowDiscount(false)
		setCurrentPage(1)
	}

	// Обновляем URL при изменении фильтров
	useEffect(() => {
		const params = new URLSearchParams(searchParams)

		// Обновляем параметры URL
		if (selectedGrades.length > 0) {
			params.set('grades', selectedGrades.join(','))
		} else {
			params.delete('grades')
		}

		if (selectedCardType !== 'Все типы') {
			params.set('cardType', selectedCardType)
		} else {
			params.delete('cardType')
		}

		if (selectedPriceRange !== 'all') {
			params.set('priceRange', selectedPriceRange)
		} else {
			params.delete('priceRange')
		}

		if (showDiscount) {
			params.set('discount', 'true')
		} else {
			params.delete('discount')
		}

		if (sortBy !== 'popular') {
			params.set('sort', sortBy)
		} else {
			params.delete('sort')
		}

		if (currentPage !== 1) {
			params.set('page', currentPage.toString())
		} else {
			params.delete('page')
		}

		if (viewMode !== 'grid') {
			params.set('view', viewMode)
		} else {
			params.delete('view')
		}

		// Обновляем URL без перезагрузки страницы
		const newUrl = params.toString()
			? `${pathname}?${params.toString()}`
			: pathname
		router.push(newUrl, { scroll: false })
	}, [
		selectedGrades,
		selectedCardType,
		selectedPriceRange,
		showDiscount,
		sortBy,
		currentPage,
		viewMode,
		pathname,
		router,
		searchParams,
	])

	// Сбрасываем страницу при изменении фильтров
	useEffect(() => {
		setCurrentPage(1)
	}, [
		selectedGrades,
		selectedCardType,
		selectedPriceRange,
		showDiscount,
		sortBy,
		viewMode,
	])

	// Генерируем данные Schema.org для товаров
	const generateCatalogSchema = () => {
		return {
			'@context': 'https://schema.org',
			'@type': 'ItemList',
			name: `Каталог учебных карточек${
				categorySlug !== 'catalog' ? ` - ${categorySlug}` : ''
			}`,
			itemListOrder: 'https://schema.org/ItemListUnordered',
			numberOfItems: currentProducts.length,
			itemListElement: currentProducts.map((product, index) => ({
				'@type': 'ListItem',
				position: index + 1,
				item: {
					'@type': 'Product',
					name: product.title,
					url: `https://mat-focus.ru/product/${product.slug}`,
					image: product.image?.[0]?.url,
					description: product.description,
					offers: {
						'@type': 'Offer',
						price: product.price,
						priceCurrency: 'RUB',
						availability:
							product.quantity > 0
								? 'https://schema.org/InStock'
								: 'https://schema.org/OutOfStock',
					},
				},
			})),
		}
	}

	return (
		<>
			{/* Schema.org разметка для товаров */}
			<SchemaOrg data={generateCatalogSchema()} />

			<div className="flex flex-col md:flex-row gap-6">
				{/* Фильтры */}
				<FiltersPanel
					categories={categories}
					categorySlug={categorySlug}
					selectedGrades={selectedGrades}
					setSelectedGrades={setSelectedGrades}
					selectedCardType={selectedCardType}
					setSelectedCardType={setSelectedCardType}
					selectedPriceRange={selectedPriceRange}
					setSelectedPriceRange={setSelectedPriceRange}
					showDiscount={showDiscount}
					setShowDiscount={setShowDiscount}
					resetFilters={resetFilters}
					showMobileFilter={showMobileFilter}
					setShowMobileFilter={setShowMobileFilter}
					grades={grades}
					isLoading={isLoading}
				/>

				{/* Основной контент */}
				<div className="md:w-3/4 lg:w-4/5">
					{/* Верхняя панель с сортировкой и информацией */}
					<SortingBar
						totalProducts={filteredProducts.length}
						sortBy={sortBy}
						setSortBy={setSortBy}
						view={viewMode}
						setView={setViewMode}
					/>

					{/* Список товаров */}
					{currentProducts.length > 0 ? (
						viewMode === 'grid' ? (
							<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
								{currentProducts.map((product) => (
									<ProductCard
										key={product.id}
										product={product}
										variant="catalog"
									/>
								))}
							</div>
						) : (
							<div className="flex flex-col gap-4">
								{currentProducts.map((product) => (
									<ProductListItem key={product.id} product={product} />
								))}
							</div>
						)
					) : (
						<div className="bg-white p-8 rounded-lg text-center">
							<p className="text-lg mb-4">
								По вашему запросу ничего не найдено
							</p>
							<p className="text-neutral-04 mb-6">
								Попробуйте изменить параметры фильтрации
							</p>
							<button
								onClick={resetFilters}
								className="bg-dark rounded-md inline-flex items-center justify-center py-3 px-7 text-center font-medium text-white hover:bg-hover transition-colors"
							>
								Сбросить фильтры
							</button>
						</div>
					)}

					{/* Пагинация */}
					{filteredProducts.length > 0 && (
						<Pagination
							currentPage={currentPage}
							totalPages={totalPages}
							onChangePage={setCurrentPage}
						/>
					)}
				</div>
			</div>
		</>
	)
}
