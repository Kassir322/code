// src/components/catalog/CatalogView.js (обновленная версия)
'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import ProductCard from '@/components/ProductCard'
import ProductListItem from '@/components/ProductListItem'
import FiltersPanel from '@/components/catalog/FiltersPanel'
import SortingBar from '@/components/catalog/SortingBar'
import Pagination from '@/components/catalog/Pagination'
import { useSearchParams } from 'next/navigation'
import { filterProducts, sortProducts } from '@/lib/product-utils'
import SchemaOrg from '@/components/SchemaOrg'

export default function CatalogView({
	products,
	categories,
	categorySlug,
	initialSort = 'popular',
	initialPage = 1,
}) {
	const router = useRouter()
	const pathname = usePathname()
	const searchParams = useSearchParams()

	// Состояния для фильтров
	const [selectedGrade, setSelectedGrade] = useState('Все классы')
	const [selectedCardType, setSelectedCardType] = useState('Все типы')
	const [selectedPriceRange, setSelectedPriceRange] = useState('all')
	const [showDiscount, setShowDiscount] = useState(false)
	const [sortBy, setSortBy] = useState(initialSort)
	const [currentPage, setCurrentPage] = useState(initialPage)
	const [showMobileFilter, setShowMobileFilter] = useState(false)
	const [viewMode, setViewMode] = useState('grid')

	// Количество продуктов на странице
	const productsPerPage = viewMode === 'grid' ? 9 : 5

	// Применяем фильтры к продуктам
	const filteredProducts = filterProducts(products, {
		subject: categorySlug,
		grade: selectedGrade,
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
		setSelectedGrade('Все классы')
		setSelectedCardType('Все типы')
		setSelectedPriceRange('all')
		setShowDiscount(false)
		setCurrentPage(1)
	}

	// Обновляем URL при изменении фильтров для SEO и возможности поделиться ссылкой
	useEffect(() => {
		const params = new URLSearchParams(searchParams)

		// Обновляем параметры URL
		if (sortBy !== 'popular') params.set('sort', sortBy)
		else params.delete('sort')

		if (currentPage !== 1) params.set('page', currentPage.toString())
		else params.delete('page')

		if (viewMode !== 'grid') params.set('view', viewMode)
		else params.delete('view')

		// Добавляем другие фильтры по необходимости
		if (selectedGrade !== 'Все классы') params.set('grade', selectedGrade)
		else params.delete('grade')

		// Обновляем URL без перезагрузки страницы
		const newUrl = params.toString()
			? `${pathname}?${params.toString()}`
			: pathname
		router.push(newUrl, { scroll: false })
	}, [
		sortBy,
		currentPage,
		selectedGrade,
		viewMode,
		pathname,
		router,
		searchParams,
	])

	// Сбрасываем страницу при изменении фильтров или режима отображения
	useEffect(() => {
		setCurrentPage(1)
	}, [
		selectedGrade,
		selectedCardType,
		selectedPriceRange,
		showDiscount,
		sortBy,
		viewMode,
	])

	// Обнаруживаем изменения режима отображения из URL при первой загрузке
	useEffect(() => {
		const view = searchParams.get('view')
		if (view && (view === 'grid' || view === 'list')) {
			setViewMode(view)
		}
	}, [searchParams])

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
					name: product.name,
					url: `https://mat-focus.ru/product/${product.id}`,
					image: product.imageSrc,
					description: `Учебные карточки ${product.name}`,
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
					selectedGrade={selectedGrade}
					setSelectedGrade={setSelectedGrade}
					selectedCardType={selectedCardType}
					setSelectedCardType={setSelectedCardType}
					selectedPriceRange={selectedPriceRange}
					setSelectedPriceRange={setSelectedPriceRange}
					showDiscount={showDiscount}
					setShowDiscount={setShowDiscount}
					resetFilters={resetFilters}
					showMobileFilter={showMobileFilter}
					setShowMobileFilter={setShowMobileFilter}
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
