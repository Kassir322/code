// components/ui/SearchForm.js
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search } from 'lucide-react'

export default function SearchForm() {
	const [searchQuery, setSearchQuery] = useState('')
	const router = useRouter()

	const handleSearch = (e) => {
		e.preventDefault()
		if (searchQuery.trim()) {
			router.push(`/catalog?search=${encodeURIComponent(searchQuery.trim())}`)
		}
	}

	return (
		<form onSubmit={handleSearch} className="max-w-md mx-auto mb-8">
			<div className="relative">
				<input
					type="text"
					value={searchQuery}
					onChange={(e) => setSearchQuery(e.target.value)}
					placeholder="Поиск учебных материалов..."
					className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary-blue"
				/>
				<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
				<button
					type="submit"
					className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-secondary-blue text-white py-1 px-3 rounded-md text-sm hover:bg-blue-700 transition-colors cursor-pointer"
				>
					Найти
				</button>
			</div>
		</form>
	)
}
