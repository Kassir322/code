// src/app/about/page.js
import React from 'react'
import Breadcrumbs from '@/components/Breadcrumbs'
import SchemaOrg from '@/components/SchemaOrg'
import Image from 'next/image'
import Link from 'next/link'
import { CheckCircle, BookOpen, Brain, Award, ArrowRight } from 'lucide-react'

export const metadata = {
	title: 'О компании Mat-Focus | Эксперты в учебных материалах',
	description:
		'Mat-Focus - команда профессионалов, создающих высококачественные учебные карточки. Узнайте о нашей миссии, ценностях и подходе к образованию.',
	keywords:
		'о компании, mat-focus, учебные карточки, учебные материалы, образование',
}

export default function AboutPage() {
	// Данные для хлебных крошек
	const breadcrumbItems = [
		{ name: 'Главная', url: '/' },
		{ name: 'О компании', url: '/about' },
	]

	// Данные для Schema.org микроразметки
	const schemaData = {
		'@context': 'https://schema.org',
		'@type': 'Organization',
		name: 'Mat-Focus',
		url: 'https://mat-focus.ru',
		logo: 'https://mat-focus.ru/images/logo.svg',
		description:
			'Mat-Focus - команда профессионалов, создающих высококачественные учебные карточки для эффективного обучения.',
		contactPoint: {
			'@type': 'ContactPoint',
			telephone: '+7 (988) 866-12-76',
			contactType: 'customer service',
			email: 'control@mat-focus.ru',
			availableLanguage: 'Russian',
		},
		address: {
			'@type': 'PostalAddress',
			addressLocality: 'Ставрополь',
			addressRegion: 'Ставропольский край',
			streetAddress: 'проспект Кулакова, 47/2',
			postalCode: '355000',
			addressCountry: 'RU',
		},
		sameAs: ['https://t.me/matfocus'],
	}

	// Ключевые преимущества компании
	const benefits = [
		{
			icon: BookOpen,
			title: 'Структурированная информация',
			description:
				'Материал подобран и организован профессиональными педагогами для максимально эффективного усвоения.',
		},
		{
			icon: Brain,
			title: 'Научный подход',
			description:
				'Наши методики основаны на современных исследованиях процессов запоминания и усвоения информации.',
		},
		{
			icon: Award,
			title: 'Высокое качество',
			description:
				'Мы контролируем качество на каждом этапе: от создания контента до печати и доставки материалов.',
		},
	]

	return (
		<div className="container mx-auto px-4 mt-24 mb-16">
			{/* Хлебные крошки для навигации и SEO */}
			<Breadcrumbs items={breadcrumbItems} />

			{/* Schema.org микроразметка */}
			<SchemaOrg data={schemaData} />

			<div className="max-w-5xl mx-auto">
				<h1 className="text-3xl font-bold mb-8">О компании Mat-Focus</h1>

				{/* Введение и миссия */}
				<section className="bg-white rounded-lg shadow-sm p-8 mb-10">
					<div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
						<div className="md:col-span-2">
							<h2 className="text-2xl font-semibold mb-6">Наша миссия</h2>
							<p className="text-gray-700 mb-4">
								Mat-Focus создан командой педагогов и методистов, объединенных
								общей целью — сделать обучение более эффективным и доступным для
								всех. Мы верим, что правильно структурированный материал и
								современный подход к образованию могут существенно улучшить
								результаты обучения.
							</p>
							<p className="text-gray-700 mb-4">
								Наша миссия — помогать школьникам и студентам эффективно
								усваивать знания с помощью специально разработанных учебных
								карточек, которые делают процесс обучения более активным,
								наглядным и результативным.
							</p>
						</div>
						<div className="flex justify-center">
							<div className="relative w-64 h-64">
								<Image
									src="/images/logo.svg"
									alt="Логотип Mat-Focus"
									fill
									className="object-contain"
								/>
							</div>
						</div>
					</div>
				</section>

				{/* История и ценности */}
				<section className="bg-white rounded-lg shadow-sm p-8 mb-10">
					<h2 className="text-2xl font-semibold mb-6">История и ценности</h2>
					<p className="text-gray-700 mb-4">
						Компания Mat-Focus была основана группой педагогов-энтузиастов,
						которые на своем опыте убедились, что традиционные методы обучения
						не всегда дают желаемый результат. Работая с учениками разных
						возрастов, мы заметили, что использование карточек с
						структурированной информацией значительно повышает эффективность
						запоминания и понимания материала.
					</p>
					<p className="text-gray-700 mb-4">
						Мы начали с создания небольших наборов карточек для своих учеников,
						и видя их успех, решили масштабировать эту идею. Так появился
						Mat-Focus — проект, направленный на создание высококачественных
						учебных материалов, доступных для всех.
					</p>
					<div className="bg-blue-50 p-6 rounded-lg mt-8">
						<h3 className="text-xl font-medium text-secondary-blue mb-4">
							Наши ценности:
						</h3>
						<ul className="space-y-3">
							<li className="flex items-start">
								<CheckCircle className="h-5 w-5 text-secondary-blue mt-0.5 mr-3 flex-shrink-0" />
								<p className="text-gray-700">
									<strong>Качество обучения</strong> — мы создаем материалы,
									которые действительно работают и помогают учиться.
								</p>
							</li>
							<li className="flex items-start">
								<CheckCircle className="h-5 w-5 text-secondary-blue mt-0.5 mr-3 flex-shrink-0" />
								<p className="text-gray-700">
									<strong>Доступность</strong> — мы стремимся сделать
									эффективные учебные материалы доступными для каждого.
								</p>
							</li>
							<li className="flex items-start">
								<CheckCircle className="h-5 w-5 text-secondary-blue mt-0.5 mr-3 flex-shrink-0" />
								<p className="text-gray-700">
									<strong>Инновации</strong> — мы постоянно совершенствуем наши
									методики, основываясь на последних исследованиях в области
									образования.
								</p>
							</li>
							<li className="flex items-start">
								<CheckCircle className="h-5 w-5 text-secondary-blue mt-0.5 mr-3 flex-shrink-0" />
								<p className="text-gray-700">
									<strong>Честность</strong> — мы всегда открыты для обратной
									связи и постоянно работаем над улучшением наших продуктов.
								</p>
							</li>
						</ul>
					</div>
				</section>

				{/* Команда */}
				<section className="bg-white rounded-lg shadow-sm p-8 mb-10">
					<h2 className="text-2xl font-semibold mb-6">Наша команда</h2>
					<p className="text-gray-700 mb-4">
						В команде Mat-Focus работают опытные педагоги, методисты и
						специалисты в области образования. Каждый из нас имеет многолетний
						опыт работы в образовательной сфере и понимает, с какими трудностями
						сталкиваются ученики при изучении различных предметов.
					</p>
					<p className="text-gray-700 mb-8">
						Мы тщательно отбираем материал для наших карточек, структурируем его
						и представляем в максимально понятной и запоминающейся форме. Каждый
						набор карточек создается совместно педагогами-предметниками и
						методистами, чтобы обеспечить как точность информации, так и
						эффективность её усвоения.
					</p>
				</section>

				{/* Преимущества */}
				<section className="bg-white rounded-lg shadow-sm p-8 mb-10">
					<h2 className="text-2xl font-semibold mb-8">Наши преимущества</h2>

					<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
						{benefits.map((benefit, index) => (
							<div
								key={index}
								className="flex flex-col items-center text-center p-6 rounded-lg border border-gray-100 hover:shadow-md transition-shadow"
							>
								<div className="bg-primary-light rounded-full p-4 mb-4">
									<benefit.icon className="h-8 w-8 text-primary" />
								</div>
								<h3 className="text-xl font-semibold mb-3">{benefit.title}</h3>
								<p className="text-gray-600">{benefit.description}</p>
							</div>
						))}
					</div>
				</section>

				{/* Процесс работы */}
				<section className="bg-white rounded-lg shadow-sm p-8 mb-10">
					<h2 className="text-2xl font-semibold mb-6">Как мы работаем</h2>

					<div className="space-y-6">
						<div className="flex flex-col md:flex-row items-start border-b border-gray-200 pb-6">
							<div className="bg-secondary-blue text-white text-xl font-bold rounded-full w-10 h-10 flex items-center justify-center mr-4 flex-shrink-0 mb-4 md:mb-0">
								1
							</div>
							<div>
								<h3 className="text-xl font-medium mb-2">
									Разработка концепции
								</h3>
								<p className="text-gray-700">
									Наши методисты определяют ключевые темы и концепции, которые
									необходимо включить в набор учебных карточек, ориентируясь на
									школьную программу и требования экзаменов.
								</p>
							</div>
						</div>

						<div className="flex flex-col md:flex-row items-start border-b border-gray-200 pb-6">
							<div className="bg-secondary-blue text-white text-xl font-bold rounded-full w-10 h-10 flex items-center justify-center mr-4 flex-shrink-0 mb-4 md:mb-0">
								2
							</div>
							<div>
								<h3 className="text-xl font-medium mb-2">Создание контента</h3>
								<p className="text-gray-700">
									Педагоги-предметники разрабатывают содержание каждой карточки,
									структурируя информацию таким образом, чтобы она была
									максимально понятной и запоминающейся.
								</p>
							</div>
						</div>

						<div className="flex flex-col md:flex-row items-start border-b border-gray-200 pb-6">
							<div className="bg-secondary-blue text-white text-xl font-bold rounded-full w-10 h-10 flex items-center justify-center mr-4 flex-shrink-0 mb-4 md:mb-0">
								3
							</div>
							<div>
								<h3 className="text-xl font-medium mb-2">Дизайн и печать</h3>
								<p className="text-gray-700">
									Наши дизайнеры создают визуально привлекательный и
									функциональный макет карточек, который затем отправляется в
									печать на качественном оборудовании.
								</p>
							</div>
						</div>

						<div className="flex flex-col md:flex-row items-start">
							<div className="bg-secondary-blue text-white text-xl font-bold rounded-full w-10 h-10 flex items-center justify-center mr-4 flex-shrink-0 mb-4 md:mb-0">
								4
							</div>
							<div>
								<h3 className="text-xl font-medium mb-2">
									Контроль качества и доставка
								</h3>
								<p className="text-gray-700">
									Каждый набор карточек проходит строгую проверку качества,
									после чего упаковывается и отправляется заказчику. Мы
									обеспечиваем надежную доставку по всей России.
								</p>
							</div>
						</div>
					</div>
				</section>

				{/* Контакты и CTA */}
				<section className="bg-primary-light rounded-lg p-8 text-center">
					<h2 className="text-2xl font-semibold mb-4">Остались вопросы?</h2>
					<p className="text-gray-700 mb-6 max-w-3xl mx-auto">
						Мы всегда открыты для общения и готовы ответить на все ваши вопросы.
						Свяжитесь с нами удобным для вас способом, и мы поможем подобрать
						оптимальные учебные материалы.
					</p>
					<Link
						href="/contact"
						className="inline-flex items-center justify-center py-3 px-6 bg-dark rounded-md text-white font-medium hover:bg-hover transition-colors cursor-pointer"
					>
						Связаться с нами
						<ArrowRight className="ml-2 h-5 w-5" />
					</Link>
				</section>
			</div>
		</div>
	)
}
