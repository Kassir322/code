'use client'

import React from 'react'
import Link from 'next/link'
import HeroSection from '@/components/sections/HeroSection'
import BenefitsSection from '@/components/sections/BenefitsSection'
import HowItWorks from '@/components/sections/HowItWorks'
import ProductCards from '@/components/sections/ProductCards'
import TestimonialsSlider from '@/components/sections/TestimonialsSlider'
import NewsletterSection from '@/components/sections/NewsletterSection'

// Примеры товаров для главной страницы
const featuredProducts = [
	{
		id: 1,
		name: 'Карточки по математике "Алгебра 8-9 класс"',
		price: 890,
		oldPrice: 1190,
		rating: 4.8,
		reviewCount: 124,
		imageSrc: '/images/products/math-cards.jpg',
		label: 'Хит продаж',
	},
	{
		id: 2,
		name: 'Карточки по физике "Механика 10 класс"',
		price: 950,
		oldPrice: null,
		rating: 4.5,
		reviewCount: 87,
		imageSrc: '/images/products/physics-cards.jpg',
		label: 'Новинка',
	},
	{
		id: 3,
		name: 'Карточки по русскому языку "Орфография 5-6 класс"',
		price: 790,
		oldPrice: 990,
		rating: 4.7,
		reviewCount: 156,
		imageSrc: '/images/products/russian-cards.jpg',
		label: 'Скидка 20%',
	},
]

// Примеры отзывов для слайдера
const testimonials = [
	{
		id: 1,
		name: 'Анна В.',
		rating: 5,
		date: '15.03.2025',
		text: 'Моему сыну очень понравились карточки по математике. Он стал лучше понимать алгебру, и это отразилось на его оценках. Формат вопрос-ответ отлично подходит для повторения перед контрольными.',
	},
	{
		id: 2,
		name: 'Михаил К.',
		rating: 4,
		date: '02.02.2025',
		text: 'Заказывал карточки по физике. Качество печати отличное, материал изложен понятно и структурированно. Единственное, хотелось бы больше практических задач, но в целом очень доволен.',
	},
	{
		id: 3,
		name: 'Елена Д.',
		rating: 5,
		date: '20.01.2025',
		text: 'Карточки помогли моей дочери подготовиться к экзаменам. Удобно, что можно брать с собой куда угодно и заниматься в любую свободную минуту. Обязательно закажем ещё для подготовки к следующему году.',
	},
]

export default function Home() {
	return (
		<div className="flex flex-col min-h-screen">
			<main className="flex-grow">
				{/* Hero Section */}
				<HeroSection />

				{/* Benefits Section */}
				<BenefitsSection />

				{/* Featured Products */}
				<section className="py-12 bg-gray-50">
					<div className="container mx-auto px-4">
						<h2 className="text-3xl font-bold text-center mb-8">
							Популярные товары
						</h2>
						<ProductCards products={featuredProducts} />
						<div className="text-center mt-8">
							<Link
								href="/catalog"
								className="inline-block bg-primary text-white font-medium py-3 px-6 rounded-md hover:bg-primary-dark transition-colors"
							>
								Посмотреть все товары
							</Link>
						</div>
					</div>
				</section>

				{/* How It Works */}
				<HowItWorks />

				{/* Testimonials */}
				<section className="py-16 bg-white">
					<div className="container mx-auto px-4">
						<h2 className="text-3xl font-bold text-center mb-8">
							Отзывы наших клиентов
						</h2>
						<TestimonialsSlider testimonials={testimonials} />
					</div>
				</section>

				{/* Newsletter Subscription */}
				<NewsletterSection />
			</main>
		</div>
	)
}
