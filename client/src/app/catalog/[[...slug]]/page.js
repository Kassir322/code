'use client'

import React, { useState, useEffect } from 'react'
import { ChevronDown, Filter, X } from 'lucide-react'
import ProductCard from '@/components/ProductCard'
import MyButton from '@/components/ui/MyButton'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

// Временные моковые данные для демонстрации
const productMockData = [
	{
		id: 1,
		name: 'Карточки по математике 5-6 класс',
		price: 890,
		oldPrice: 1190,
		rating: 4.8,
		reviewCount: 124,
		imageSrc: '/images/products/math-cards.jpg',
		label: 'Хит продаж',
		subject: 'Математика',
		grade: '5-6 класс',
		cardType: 'Вопрос-ответ',
	},
	{
		id: 2,
		name: 'Карточки по физике ОГЭ',
		price: 950,
		oldPrice: null,
		rating: 4.5,
		reviewCount: 87,
		imageSrc: '/images/products/physics-cards.jpg',
		label: 'Новинка',
		subject: 'Физика',
		grade: '9 класс',
		cardType: 'Шпаргалки',
	},
	{
		id: 3,
		name: 'Карточки по русскому языку ЕГЭ',
		price: 790,
		oldPrice: 990,
		rating: 4.7,
		reviewCount: 156,
		imageSrc: '/images/products/russian-cards.jpg',
		label: 'Скидка 20%',
		subject: 'Русский язык',
		grade: '11 класс',
		cardType: 'Комбинированный',
	},
	{
		id: 4,
		name: 'Карточки по биологии 7-8 класс',
		price: 850,
		oldPrice: 1050,
		rating: 4.6,
		reviewCount: 92,
		imageSrc: '/images/products/biology-cards.jpg',
		label: null,
		subject: 'Биология',
		grade: '7-8 класс',
		cardType: 'Вопрос-ответ',
	},
	{
		id: 5,
		name: 'Карточки по химии 8-9 класс',
		price: 920,
		oldPrice: null,
		rating: 4.4,
		reviewCount: 78,
		imageSrc: '/images/products/chemistry-cards.jpg',
		label: null,
		subject: 'Химия',
		grade: '8-9 класс',
		cardType: 'Шпаргалки',
	},
	{
		id: 6,
		name: 'Карточки по истории ЕГЭ',
		price: 990,
		oldPrice: 1290,
		rating: 4.9,
		reviewCount: 142,
		imageSrc: '/images/products/history-cards.jpg',
		label: 'Топ продаж',
		subject: 'История',
		grade: '11 класс',
		cardType: 'Комбинированный',
	},
	{
		id: 7,
		name: 'Карточки по английскому языку 5-7 класс',
		price: 780,
		oldPrice: 920,
		rating: 4.7,
		reviewCount: 112,
		imageSrc: '/images/products/english-cards.jpg',
		label: 'Скидка 15%',
		subject: 'Английский язык',
		grade: '5-7 класс',
		cardType: 'Вопрос-ответ',
	},
	{
		id: 8,
		name: 'Карточки по литературе 10-11 класс',
		price: 860,
		oldPrice: null,
		rating: 4.6,
		reviewCount: 94,
		imageSrc: '/images/products/literature-cards.jpg',
		label: null,
		subject: 'Литература',
		grade: '10-11 класс',
		cardType: 'Шпаргалки',
	},
	{
		id: 9,
		name: 'Карточки по географии 6-7 класс',
		price: 760,
		oldPrice: 890,
		rating: 4.5,
		reviewCount: 82,
		imageSrc: '/images/products/geography-cards.jpg',
		label: null,
		subject: 'География',
		grade: '6-7 класс',
		cardType: 'Вопрос-ответ',
	},
	{
		id: 10,
		name: 'Карточки по обществознанию ОГЭ',
		price: 880,
		oldPrice: 1080,
		rating: 4.8,
		reviewCount: 136,
		imageSrc: '/images/products/society-cards.jpg',
		label: 'Хит продаж',
		subject: 'Обществознание',
		grade: '9 класс',
		cardType: 'Комбинированный',
	},
	{
		id: 11,
		name: 'Карточки по информатике 8-9 класс',
		price: 840,
		oldPrice: null,
		rating: 4.6,
		reviewCount: 98,
		imageSrc: '/images/products/informatics-cards.jpg',
		label: 'Новинка',
		subject: 'Информатика',
		grade: '8-9 класс',
		cardType: 'Шпаргалки',
	},
	{
		id: 12,
		name: 'Карточки по геометрии 7-9 класс',
		price: 820,
		oldPrice: 950,
		rating: 4.7,
		reviewCount: 108,
		imageSrc: '/images/products/geometry-cards.jpg',
		label: 'Скидка 15%',
		subject: 'Геометрия',
		grade: '7-9 класс',
		cardType: 'Вопрос-ответ',
	},
]

// Категории предметов
const subjects = [
	{ name: 'Все предметы', slug: 'catalog' },
	{ name: 'Математика', slug: 'mathematics' },
	{ name: 'Русский язык', slug: 'russian-language' },
	{ name: 'Физика', slug: 'physics' },
	{ name: 'Химия', slug: 'chemistry' },
	{ name: 'Биология', slug: 'biology' },
	{ name: 'История', slug: 'history' },
	{ name: 'Обществознание', slug: 'social-science' },
	{ name: 'Английский язык', slug: 'english-language' },
	{ name: 'Литература', slug: 'literature' },
	{ name: 'География', slug: 'geography' },
	{ name: 'Информатика', slug: 'informatics' },
	{ name: 'Геометрия', slug: 'geometry' },
]

// Классы
const grades = [
	'Все классы',
	'5-6 класс',
	'7-8 класс',
	'8-9 класс',
	'9 класс (ОГЭ)',
	'10-11 класс',
	'11 класс (ЕГЭ)',
]

// Типы карточек
const cardTypes = ['Все типы', 'Вопрос-ответ', 'Шпаргалки', 'Комбинированный']

// Ценовые диапазоны
const priceRanges = [
	{ id: 'all', label: 'Все цены', min: 0, max: Infinity },
	{ id: 'range1', label: 'До 800 ₽', min: 0, max: 800 },
	{ id: 'range2', label: '800 ₽ - 900 ₽', min: 800, max: 900 },
	{ id: 'range3', label: '900 ₽ - 1000 ₽', min: 900, max: 1000 },
	{ id: 'range4', label: 'Более 1000 ₽', min: 1000, max: Infinity },
]

// Опции сортировки
const sortOptions = [
	{ value: 'popular', label: 'По популярности' },
	{ value: 'price_asc', label: 'По возрастанию цены' },
	{ value: 'price_desc', label: 'По убыванию цены' },
	{ value: 'rating', label: 'По рейтингу' },
	{ value: 'newest', label: 'Сначала новинки' },
]

export default function Page({ params }) {
	const path = usePathname().split('/')
	const subject = path[path.length - 1]

	const activeSubject = subjects.find((item) => item.slug === subject)

	// Состояния для фильтров
	const [selectedSubject, setSelectedSubject] = useState(activeSubject.name)
	const [selectedGrade, setSelectedGrade] = useState('Все классы')
	const [selectedCardType, setSelectedCardType] = useState('Все типы')
	const [selectedPriceRange, setSelectedPriceRange] = useState('all')
	const [showDiscount, setShowDiscount] = useState(false)
	const [sortBy, setSortBy] = useState('popular')
	const [currentPage, setCurrentPage] = useState(1)
	const [showMobileFilter, setShowMobileFilter] = useState(false)
	// Количество продуктов на странице
	const productsPerPage = 9

	// Фильтрация продуктов
	const filteredProducts = productMockData.filter((product) => {
		// Фильтр по предмету
		if (
			selectedSubject !== 'Все предметы' &&
			product.subject !== selectedSubject
		) {
			return false
		}

		// Фильтр по классу
		if (selectedGrade !== 'Все классы' && product.grade !== selectedGrade) {
			return false
		}

		// Фильтр по типу карточек
		if (
			selectedCardType !== 'Все типы' &&
			product.cardType !== selectedCardType
		) {
			return false
		}

		// Фильтр по цене
		const priceRange = priceRanges.find(
			(range) => range.id === selectedPriceRange
		)
		if (
			priceRange &&
			(product.price < priceRange.min || product.price > priceRange.max)
		) {
			return false
		}

		// Фильтр по скидке
		if (showDiscount && !product.oldPrice) {
			return false
		}

		return true
	})

	// Сортировка продуктов
	const sortedProducts = [...filteredProducts].sort((a, b) => {
		switch (sortBy) {
			case 'price_asc':
				return a.price - b.price
			case 'price_desc':
				return b.price - a.price
			case 'rating':
				return b.rating - a.rating
			case 'newest':
				return (b.label === 'Новинка' ? 1 : 0) - (a.label === 'Новинка' ? 1 : 0)
			case 'popular':
			default:
				return b.reviewCount - a.reviewCount
		}
	})

	// Пагинация
	const totalPages = Math.ceil(sortedProducts.length / productsPerPage)
	const indexOfLastProduct = currentPage * productsPerPage
	const indexOfFirstProduct = indexOfLastProduct - productsPerPage
	const currentProducts = sortedProducts.slice(
		indexOfFirstProduct,
		indexOfLastProduct
	)

	// Функция для генерации разметки пагинации
	const renderPaginationButtons = () => {
		const buttons = []

		// Кнопка "Предыдущая страница"
		buttons.push(
			<button
				key="prev"
				onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
				disabled={currentPage === 1}
				className="px-3 py-1 rounded border border-gray-300 disabled:text-gray-400 disabled:cursor-not-allowed hover:bg-neutral-02"
			>
				←
			</button>
		)

		// Номера страниц
		for (let i = 1; i <= totalPages; i++) {
			buttons.push(
				<button
					key={i}
					onClick={() => setCurrentPage(i)}
					className={`px-3 py-1 rounded ${
						currentPage === i
							? 'bg-secondary-blue text-white'
							: 'border border-gray-300 hover:bg-neutral-02'
					}`}
				>
					{i}
				</button>
			)
		}

		// Кнопка "Следующая страница"
		buttons.push(
			<button
				key="next"
				onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
				disabled={currentPage === totalPages}
				className="px-3 py-1 rounded border border-gray-300 disabled:text-gray-400 disabled:cursor-not-allowed hover:bg-neutral-02"
			>
				→
			</button>
		)

		return buttons
	}

	// Сбросить фильтры
	const resetFilters = () => {
		setSelectedSubject('Все предметы')
		setSelectedGrade('Все классы')
		setSelectedCardType('Все типы')
		setSelectedPriceRange('all')
		setShowDiscount(false)
		setCurrentPage(1)
	}

	useEffect(() => {
		// Сбросить страницу на первую при изменении фильтров
		setCurrentPage(1)
	}, [
		selectedSubject,
		selectedGrade,
		selectedCardType,
		selectedPriceRange,
		showDiscount,
		sortBy,
	])

	return (
		<div className="container mx-auto px-4 mt-24 mb-16">
			<h1 className="text-3xl font-bold mb-6">Каталог учебных карточек</h1>

			{/* Мобильная кнопка фильтра */}
			<div className="md:hidden mb-4">
				<button
					onClick={() => setShowMobileFilter(!showMobileFilter)}
					className="flex items-center justify-center w-full py-2 border border-gray-300 rounded bg-white"
				>
					<Filter className="h-5 w-5 mr-2" />
					Фильтры и сортировка
				</button>
			</div>

			<div className="flex flex-col md:flex-row gap-6">
				{/* Сайдбар с фильтрами - десктопная версия */}
				<div
					className={`md:w-1/4 lg:w-1/5 md:block  ${
						showMobileFilter ? 'block' : 'hidden'
					}`}
				>
					<div className="bg-white md:rounded-lg p-4 shadow-sm  md:top-24">
						{/* Мобильная шапка фильтра */}
						<div className="flex justify-between items-center mb-4 md:hidden">
							<h3 className="font-semibold text-lg">Фильтры</h3>
							<button
								onClick={() => setShowMobileFilter(false)}
								className="p-1 rounded-full hover:bg-gray-100"
							>
								<X className="h-5 w-5" />
							</button>
						</div>

						<div className="flex justify-between items-center mb-4">
							<h2 className="font-semibold text-xl">Категории</h2>
						</div>

						{/* Фильтр по предмету */}
						<div className="mb-6">
							<ul className="space-y-2 ">
								{subjects.map((subject) => (
									<li key={subject.name}>
										<label className="flex items-center cursor-pointer">
											<Link href={`/catalog/${subject.slug}`}>
												<input
													type="radio"
													name="subject"
													checked={selectedSubject === subject.name}
													onChange={() => {
														setSelectedSubject(subject.name)
													}}
													className="mr-2 accent-secondary-blue "
												/>
												<span className="text-neutral-05 hover:text-secondary-blue">
													{subject.name}
												</span>
											</Link>
										</label>
									</li>
								))}
							</ul>
						</div>

						<div className="flex justify-between items-center mb-4">
							<h3 className="font-semibold text-lg">Фильтры</h3>
							<button
								onClick={resetFilters}
								className="text-sm text-secondary-blue hover:underline"
							>
								Сбросить
							</button>
						</div>

						{/* Фильтр по классу */}
						<div className="mb-6">
							<h4 className="font-medium mb-2">Класс</h4>
							<ul className="space-y-2">
								{grades.map((grade) => (
									<li key={grade}>
										<label className="flex items-center cursor-pointer">
											<input
												type="radio"
												name="grade"
												checked={selectedGrade === grade}
												onChange={() => setSelectedGrade(grade)}
												className="mr-2 accent-secondary-blue"
											/>
											<span className="text-neutral-05 hover:text-secondary-blue">
												{grade}
											</span>
										</label>
									</li>
								))}
							</ul>
						</div>

						{/* Фильтр по типу карточек */}
						<div className="mb-6">
							<h4 className="font-medium mb-2">Тип карточек</h4>
							<ul className="space-y-2">
								{cardTypes.map((type) => (
									<li key={type}>
										<label className="flex items-center cursor-pointer">
											<input
												type="radio"
												name="cardType"
												checked={selectedCardType === type}
												onChange={() => setSelectedCardType(type)}
												className="mr-2 accent-secondary-blue"
											/>
											<span className="text-neutral-05 hover:text-secondary-blue">
												{type}
											</span>
										</label>
									</li>
								))}
							</ul>
						</div>

						{/* Фильтр по цене */}
						<div className="mb-6">
							<h4 className="font-medium mb-2">Цена</h4>
							<ul className="space-y-2">
								{priceRanges.map((range) => (
									<li key={range.id}>
										<label className="flex items-center cursor-pointer">
											<input
												type="radio"
												name="priceRange"
												checked={selectedPriceRange === range.id}
												onChange={() => setSelectedPriceRange(range.id)}
												className="mr-2 accent-secondary-blue"
											/>
											<span className="text-neutral-05 hover:text-secondary-blue">
												{range.label}
											</span>
										</label>
									</li>
								))}
							</ul>
						</div>

						{/* Фильтр по скидке */}
						<div className="mb-6">
							<label className="flex items-center cursor-pointer">
								<input
									type="checkbox"
									checked={showDiscount}
									onChange={() => setShowDiscount(!showDiscount)}
									className="mr-2 accent-secondary-blue"
								/>
								<span className="text-neutral-05">Только со скидкой</span>
							</label>
						</div>

						{/* Кнопка применить (для мобильного) */}
						<div className="md:hidden mt-4">
							<MyButton
								className="w-full"
								onClick={() => setShowMobileFilter(false)}
							>
								Применить фильтры
							</MyButton>
						</div>
					</div>
				</div>

				{/* Основной контент */}
				<div className="md:w-3/4 lg:w-4/5">
					{/* Верхняя панель с сортировкой и информацией */}
					<div className="flex flex-col sm:flex-row sm:justify-between justify-center items-center sm:items-center mb-6 bg-white p-4 rounded-lg shadow-sm">
						<div className="mb-3 sm:mb-0">
							<p className="text-neutral-04">
								Найдено:{' '}
								<span className="font-semibold">{filteredProducts.length}</span>{' '}
								товаров
							</p>
						</div>

						<div className="flex items-center space-x-2  sm:self-auto">
							<span className="text-neutral-05">Сортировка:</span>
							<div className="relative">
								<select
									value={sortBy}
									onChange={(e) => setSortBy(e.target.value)}
									className="appearance-none border rounded py-2 px-4 pr-8 leading-tight focus:outline-none focus:border-secondary-blue bg-white"
								>
									{sortOptions.map((option) => (
										<option key={option.value} value={option.value}>
											{option.label}
										</option>
									))}
								</select>
								<div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
									<ChevronDown className="h-4 w-4" />
								</div>
							</div>
						</div>
					</div>

					{/* Список товаров */}
					{currentProducts.length > 0 ? (
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
							{currentProducts.map((product) => (
								<ProductCard
									variant="catalog"
									key={product.id}
									product={product}
								/>
							))}
						</div>
					) : (
						<div className="bg-white p-8 rounded-lg text-center">
							<p className="text-lg mb-4">
								По вашему запросу ничего не найдено
							</p>
							<p className="text-neutral-04 mb-6">
								Попробуйте изменить параметры фильтрации
							</p>
							<MyButton onClick={resetFilters}>Сбросить фильтры</MyButton>
						</div>
					)}

					{/* Пагинация */}
					{filteredProducts.length > 0 && (
						<div className="mt-8 flex justify-center space-x-2">
							{renderPaginationButtons()}
						</div>
					)}
				</div>
			</div>
		</div>
	)
}
