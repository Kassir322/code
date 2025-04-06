import React from 'react'
import Link from 'next/link'
import MyButton from '../ui/MyButton'

export default function HeroSection() {
	return (
		<section className="py-16 md:py-24 bg-neutral-01">
			<div className="container mx-auto px-4 max-w-5xl">
				<div className="text-center">
					<h1 className=" text-4xl md:text-5xl font-bold text-gray-900 mb-4">
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
					<MyButton>Перейти в каталог</MyButton>
					<button className="bg-dark dark:bg-dark-2 border-dark dark:border-dark-2 border rounded-full inline-flex items-center justify-center py-3 px-7 text-center text-base font-medium text-white hover:bg-body-color hover:border-body-color disabled:bg-gray-3 disabled:border-gray-3 disabled:text-dark-5">
						Get Started
					</button>
				</div>
			</div>
		</section>
	)
}
