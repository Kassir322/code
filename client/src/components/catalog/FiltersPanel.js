// src/components/catalog/FiltersPanel.js
'use client'

import { Filter, X } from 'lucide-react'
import Link from 'next/link'

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

export default function FiltersPanel({
	categories,
	categorySlug,
	selectedGrade,
	setSelectedGrade,
	selectedCardType,
	setSelectedCardType,
	selectedPriceRange,
	setSelectedPriceRange,
	showDiscount,
	setShowDiscount,
	resetFilters,
	showMobileFilter,
	setShowMobileFilter,
}) {
	// Преобразуем категории в формат для отображения
	const subjects = [
		{ name: 'Все предметы', slug: '/all' },
		...(categories?.map((category) => ({
			name: category.name,
			slug: category.slug,
		})) || []),
	]

	// Находим активную категорию, используя пустую строку для "Все предметы"
	const activeSubject =
		subjects.find(
			(item) =>
				item.slug === categorySlug ||
				(categorySlug === 'catalog' && item.slug === '')
		) || subjects[0]

	return (
		<>
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

			{/* Сайдбар с фильтрами */}
			<div
				className={`md:w-1/4 lg:w-1/5 md:block ${
					showMobileFilter ? 'block' : 'hidden'
				}`}
			>
				<div className="bg-white md:rounded-lg p-4 shadow-sm md:top-24">
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
						<ul className="space-y-2">
							{subjects.map((subject) => (
								<li key={subject.name}>
									<label className="flex items-center cursor-pointer">
										<Link
											href={`/catalog${subject.slug ? `/${subject.slug}` : ''}`}
										>
											<span
												className={`text-neutral-05 hover:text-secondary-blue ${
													activeSubject.name === subject.name
														? 'font-semibold text-secondary-blue'
														: ''
												}`}
											>
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
						<button
							className="w-full bg-dark rounded-md inline-flex items-center justify-center py-3 px-7 text-center font-medium text-white hover:bg-hover transition-colors"
							onClick={() => setShowMobileFilter(false)}
						>
							Применить фильтры
						</button>
					</div>
				</div>
			</div>
		</>
	)
}
