// src/components/catalog/FiltersPanel.js
'use client'

import { Filter, X } from 'lucide-react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

// Типы карточек
const cardTypes = ['Все типы', 'Вопрос-ответ', 'Шпаргалки', 'Комбинированный']

// Ценовые диапазоны
const priceRanges = [
	{ id: 'all', label: 'Все цены', min: 0, max: Infinity },
	{ id: 'range1', label: 'До 400 ₽', min: 0, max: 400 },
	{ id: 'range2', label: '400 ₽ - 600 ₽', min: 400, max: 600 },
	{ id: 'range3', label: '600 ₽ - 800 ₽', min: 600, max: 800 },
	{ id: 'range4', label: 'Более 800 ₽', min: 800, max: Infinity },
]

export default function FiltersPanel({
	categories,
	categorySlug,
	selectedGrades,
	setSelectedGrades,
	selectedCardType,
	setSelectedCardType,
	selectedPriceRange,
	setSelectedPriceRange,
	showDiscount,
	setShowDiscount,
	resetFilters,
	showMobileFilter,
	setShowMobileFilter,
	grades,
	isLoading,
}) {
	const router = useRouter()
	const searchParams = useSearchParams()

	// Обновление URL при изменении выбранных классов
	const handleGradeChange = (gradeId) => {
		let newSelectedGrades

		if (gradeId === 'all') {
			// Если выбрали "Все классы", снимаем выбор с остальных
			newSelectedGrades = ['all']
		} else {
			// Если выбрали конкретный класс
			if (selectedGrades.includes('all')) {
				// Если был выбран "Все классы", снимаем его и добавляем новый класс
				newSelectedGrades = [gradeId]
			} else {
				// Иначе добавляем/удаляем класс из списка
				newSelectedGrades = selectedGrades.includes(gradeId)
					? selectedGrades.filter((id) => id !== gradeId)
					: [...selectedGrades, gradeId]
			}
		}

		setSelectedGrades(newSelectedGrades)
	}

	// Преобразуем категории в формат для отображения
	const subjects = [
		{ name: 'Все предметы', slug: '/all' },
		...(categories?.map((category) => ({
			name: category.name,
			slug: category.slug,
		})) || []),
	]

	// Находим активную категорию
	const activeSubject =
		subjects.find(
			(item) =>
				item.slug === categorySlug ||
				(categorySlug === 'catalog' && item.slug === '')
		) || subjects[0]

	// Функция для создания ссылки с сохранением параметров фильтрации
	const createCategoryLink = (slug) => {
		const params = new URLSearchParams(searchParams)
		const newPath = `/catalog${slug ? `/${slug}` : ''}`
		return `${newPath}${params.toString() ? `?${params.toString()}` : ''}`
	}

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
											href={createCategoryLink(subject.slug)}
											onClick={(e) => {
												e.preventDefault()
												router.push(createCategoryLink(subject.slug))
											}}
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
							{/* Опция "Все классы" */}
							<li>
								<label className="flex items-center cursor-pointer">
									<input
										type="checkbox"
										checked={selectedGrades.includes('all')}
										onChange={() => handleGradeChange('all')}
										className="mr-2 accent-secondary-blue"
									/>
									<span className="text-neutral-05 hover:text-secondary-blue">
										Все классы
									</span>
								</label>
							</li>
							{/* Классы из API */}
							{grades.map((grade) => (
								<li key={grade.id}>
									<label className="flex items-center cursor-pointer">
										<input
											type="checkbox"
											checked={selectedGrades.includes(grade.display_name)}
											onChange={() => handleGradeChange(grade.display_name)}
											className="mr-2 accent-secondary-blue"
										/>
										<span className="text-neutral-05 hover:text-secondary-blue">
											{`${grade.display_name} класс`}
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
