// src/app/page.js
import HeroSection from '@/components/sections/HeroSection'
import BenefitsSection from '@/components/sections/BenefitsSection'
import HowItWorks from '@/components/sections/HowItWorks'
import ProductCards from '@/components/sections/ProductCards'
import TestimonialsSlider from '@/components/sections/TestimonialsSlider'
import NewsletterSection from '@/components/sections/NewsletterSection'
import AboutSection from '@/components/sections/AboutSection'
import LinkButton from '@/components/ui/LinkButton'
import productMockData from '@/lib/mock-data'

// Обновленные примеры товаров для главной страницы с добавлением slug
// const featuredProducts = [
// 	{
// 		id: 1,
// 		name: 'Карточки по биологии 5-11 класс',
// 		price: 890,
// 		oldPrice: 1190,
// 		rating: 4.8,
// 		reviewCount: 124,
// 		imageSrc: '/images/products/math-cards.jpg',
// 		label: 'Хит продаж',
// 		slug: 'kartochki-po-biologii-5-11-klass',
// 	},
// 	{
// 		id: 2,
// 		name: 'Карточки по физике ОГЭ и ЕГЭ',
// 		price: 950,
// 		oldPrice: null,
// 		rating: 4.5,
// 		reviewCount: 87,
// 		imageSrc: '/images/products/physics-cards.jpg',
// 		label: 'Новинка',
// 		slug: 'kartochki-po-fizike-oge-i-ege',
// 	},
// 	{
// 		id: 3,
// 		name: 'Карточки по русскому языку ОГЭ и ЕГЭ',
// 		price: 790,
// 		oldPrice: 990,
// 		rating: 4.7,
// 		reviewCount: 156,
// 		imageSrc: '/images/products/russian-cards.jpg',
// 		label: 'Скидка 20%',
// 		slug: 'kartochki-po-russkomu-yazyku-oge-i-ege',
// 	},
// ]

const featuredProducts = [
	productMockData[0],
	productMockData[1],
	productMockData[2],
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

export default function Page() {
	return (
		<div className="flex flex-col min-h-screen">
			<main className="flex-grow">
				{/* Hero Section */}
				<HeroSection />

				{/* Benefits Section */}
				<BenefitsSection />

				{/* Featured Products */}
				<section className="py-12 ">
					<div className="container mx-auto px-4">
						<h2 className="text-3xl font-bold text-center mb-8">
							Популярные товары
						</h2>
						<ProductCards products={featuredProducts} />
						<div className="text-center mt-8">
							<LinkButton className="text-lg" href="/catalog">
								Посмотреть все товары
							</LinkButton>
						</div>
					</div>
				</section>

				{/* About Us Section - Добавляем компонент "О нас" */}
				<AboutSection />

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
