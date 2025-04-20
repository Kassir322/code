// src/components/sections/AboutSection.js
import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, BookOpen, Brain, Award } from 'lucide-react'

export default function AboutSection() {
	// Массив с ключевыми преимуществами
	const benefits = [
		{
			icon: BookOpen,
			title: 'Структурированная информация',
			description:
				'Материал организован педагогами для максимально эффективного усвоения.',
		},
		{
			icon: Brain,
			title: 'Удобный формат',
			description:
				'Двусторонние карточки помогают быстро проверить знания и закрепить материал.',
		},
		{
			icon: Award,
			title: 'Проверенная методология',
			description:
				'Наш подход основан на научных методах запоминания и активного обучения.',
		},
	]

	return (
		<section className="py-16 bg-white">
			<div className="container mx-auto px-4">
				<div className="max-w-5xl mx-auto">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-12">
						{/* Информация о компании */}
						<div>
							<h2 className="text-3xl font-bold mb-6">О компании Mat-Focus</h2>
							<p className="text-gray-700 mb-4">
								Mat-Focus создан командой педагогов и методистов, объединенных
								общей целью — сделать обучение более эффективным и доступным для
								всех. Мы разрабатываем учебные материалы, которые помогают
								структурировать знания и делают процесс обучения более
								результативным.
							</p>
							<p className="text-gray-700 mb-6">
								Наши учебные карточки позволяют школьникам и студентам быстрее
								усваивать новый материал, эффективно готовиться к экзаменам и
								улучшать свои результаты в учебе.
							</p>
							<Link
								href="/about"
								className="inline-flex items-center text-secondary-blue hover:underline font-medium cursor-pointer"
							>
								Узнать больше о нас
								<ArrowRight className="ml-1 h-4 w-4" />
							</Link>
						</div>

						{/* Изображение */}
						<div className="flex justify-center">
							<div className="relative w-full max-w-md aspect-[4/3] rounded-lg overflow-hidden shadow-md">
								<Image
									src="/images/products/card_example2.png"
									alt="Учебные карточки Mat-Focus"
									fill
									className="object-cover"
								/>
							</div>
						</div>
					</div>

					{/* Преимущества */}
					<h3 className="text-2xl font-semibold text-center mb-10">
						Наши преимущества
					</h3>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
						{benefits.map((benefit, index) => (
							<div
								key={index}
								className="flex flex-col items-center text-center p-6 rounded-lg bg-white shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
							>
								<div className="bg-primary-light rounded-full p-4 mb-4">
									<benefit.icon className="h-8 w-8 text-primary" />
								</div>
								<h3 className="text-xl font-semibold mb-3">{benefit.title}</h3>
								<p className="text-gray-600">{benefit.description}</p>
							</div>
						))}
					</div>

					{/* Кнопка призыва к действию */}
					<div className="mt-12 text-center">
						<Link
							href="/catalog/all"
							className="inline-flex items-center justify-center py-3 px-6 bg-dark rounded-md text-white font-medium hover:bg-hover transition-colors cursor-pointer"
						>
							Перейти к каталогу
							<ArrowRight className="ml-2 h-5 w-5" />
						</Link>
					</div>
				</div>
			</div>
		</section>
	)
}
