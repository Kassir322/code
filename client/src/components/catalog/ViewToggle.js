// src/components/catalog/ViewToggle.js
'use client'

import { Grid, List } from 'lucide-react'

export default function ViewToggle({ view, setView }) {
	return (
		<div className="flex items-center space-x-2">
			<button
				onClick={() => setView('grid')}
				className={`p-2 rounded-md cursor-pointer ${
					view === 'grid' ? 'bg-gray-200' : 'hover:bg-gray-100'
				}`}
				aria-label="Отображение плиткой"
				title="Отображение плиткой"
			>
				<Grid className="h-5 w-5" />
			</button>
			<button
				onClick={() => setView('list')}
				className={`p-2 rounded-md cursor-pointer ${
					view === 'list' ? 'bg-gray-200' : 'hover:bg-gray-100'
				}`}
				aria-label="Отображение списком"
				title="Отображение списком"
			>
				<List className="h-5 w-5" />
			</button>
		</div>
	)
}
