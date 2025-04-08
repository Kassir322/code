// src/components/catalog/SortingBar.js (обновленная версия)
'use client'

import { ChevronDown } from 'lucide-react'
import ViewToggle from './ViewToggle'

// Опции сортировки
const sortOptions = [
	{ value: 'popular', label: 'По популярности' },
	{ value: 'price_asc', label: 'По возрастанию цены' },
	{ value: 'price_desc', label: 'По убыванию цены' },
	{ value: 'rating', label: 'По рейтингу' },
	{ value: 'newest', label: 'Сначала новинки' },
]

export default function SortingBar({
	totalProducts,
	sortBy,
	setSortBy,
	view,
	setView,
}) {
	return (
		<div className="flex flex-col sm:flex-row sm:justify-between justify-center items-center sm:items-center mb-6 bg-white p-4 rounded-lg shadow-sm">
			<div className="mb-3 sm:mb-0">
				<p className="text-neutral-04">
					Найдено: <span className="font-semibold">{totalProducts}</span>{' '}
					товаров
				</p>
			</div>

			<div className="flex items-center space-x-4 sm:self-auto">
				{/* Переключатель вида отображения */}
				<ViewToggle view={view} setView={setView} />

				{/* Сортировка */}
				<div className="flex items-center space-x-2">
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
		</div>
	)
}
