// components/ui/BackButton.js
'use client'

import { ArrowLeft } from 'lucide-react'

export default function BackButton() {
	return (
		<button
			onClick={() => window.history.back()}
			className="flex items-center justify-center bg-white border border-gray-300 text-gray-700 rounded-md py-3 px-6 hover:bg-gray-50 transition-colors cursor-pointer"
		>
			<ArrowLeft className="mr-2 h-5 w-5" />
			Вернуться назад
		</button>
	)
}
