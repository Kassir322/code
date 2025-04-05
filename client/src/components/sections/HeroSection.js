import React from 'react'
import Link from 'next/link'

export default function HeroSection() {
	return (
		<section className="py-16 md:py-24 bg-gray-50">
			<div className="container mx-auto px-4 max-w-5xl">
				<div className="text-center">
					<h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
						Mat-Focus - эффективные учебные материалы для учеников
					</h1>
					<p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
						Наши учебные карточки помогают структурировать знания и делают
						процесс обучения более эффективным. Идеальное решение для подготовки
						к экзаменам и освоения новых предметов.
					</p>
					<Link
						href="/catalog"
						className="inline-block bg-primary hover:bg-primary-dark text-white font-medium text-lg py-3 px-8 rounded-md transition-colors shadow-sm"
					>
						Перейти в каталог
					</Link>
				</div>
			</div>
		</section>
	)
}
