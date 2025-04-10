// src/app/contact/page.js
import React from 'react'
import ContactForm from '@/components/contact/ContactForm'
import Breadcrumbs from '@/components/Breadcrumbs'
import SchemaOrg from '@/components/SchemaOrg'
import { Phone, Mail, Clock, MapPin } from 'lucide-react'

export const metadata = {
	title: 'Контакты магазина учебной литературы Mat-Focus | Свяжитесь с нами',
	description:
		'Свяжитесь с магазином учебной литературы Mat-Focus по телефону, email или через форму обратной связи. Мы всегда готовы ответить на ваши вопросы.',
	keywords:
		'контакты, mat-focus, учебные карточки, обратная связь, форма связи',
}

export default function ContactPage() {
	// Данные для хлебных крошек
	const breadcrumbItems = [
		{ name: 'Главная', url: '/' },
		{ name: 'Контакты', url: '/contact' },
	]

	// Данные для Schema.org микроразметки
	const schemaData = {
		'@context': 'https://schema.org',
		'@type': 'Organization',
		name: 'Mat-Focus',
		url: 'https://mat-focus.ru',
		logo: 'https://mat-focus.ru/images/logo.svg',
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
		areaServed: {
			'@type': 'Country',
			name: 'Россия',
		},
		// Указываем явно, что обслуживаем всю Россию - для SEO
		sameAs: ['https://t.me/matfocus'],
	}

	return (
		<div className="container mx-auto px-4 mt-24 mb-16">
			{/* Хлебные крошки для навигации и SEO */}
			<Breadcrumbs items={breadcrumbItems} />

			{/* Schema.org микроразметка */}
			<SchemaOrg data={schemaData} />

			<div className="max-w-5xl mx-auto">
				<h1 className="text-3xl font-bold mb-8">Контакты</h1>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-10">
					{/* Левая колонка с информацией */}
					<div>
						<div className="bg-white rounded-lg shadow-sm p-6 mb-6">
							<h2 className="text-2xl font-semibold mb-6">Наши контакты</h2>

							<div className="space-y-6">
								<div className="flex items-start">
									<Phone className="h-6 w-6 text-secondary-blue mt-1 mr-4 flex-shrink-0" />
									<div>
										<h3 className="font-medium text-lg">Телефон</h3>
										<p className="text-gray-700">
											<a
												href="tel:+79888661276"
												className="hover:text-secondary-blue transition-colors"
											>
												+7 (988) 866-12-76
											</a>
										</p>
									</div>
								</div>

								<div className="flex items-start">
									<Mail className="h-6 w-6 text-secondary-blue mt-1 mr-4 flex-shrink-0" />
									<div>
										<h3 className="font-medium text-lg">Email</h3>
										<p className="text-gray-700">
											<a
												href="mailto:control@mat-focus.ru"
												className="hover:text-secondary-blue transition-colors"
											>
												control@mat-focus.ru
											</a>
										</p>
									</div>
								</div>

								<div className="flex items-start">
									<MapPin className="h-6 w-6 text-secondary-blue mt-1 mr-4 flex-shrink-0" />
									<div>
										<h3 className="font-medium text-lg">Адрес</h3>
										<p className="text-gray-700">
											г. Ставрополь, проспект Кулакова, 47/2
										</p>
										<p className="text-gray-600 mt-1 text-sm">
											Мы осуществляем доставку по всей России
										</p>
									</div>
								</div>

								<div className="flex items-start">
									<Clock className="h-6 w-6 text-secondary-blue mt-1 mr-4 flex-shrink-0" />
									<div>
										<h3 className="font-medium text-lg">Время работы</h3>
										<div className="text-gray-700">
											<p>Пн-Пт: 9:00-18:00</p>
											<p>Сб: 10:00-15:00</p>
											<p>Вс: выходной</p>
										</div>
									</div>
								</div>
							</div>
						</div>

						<div className="bg-white rounded-lg shadow-sm p-6">
							<h2 className="text-2xl font-semibold mb-6">Социальные сети</h2>

							<div className="flex items-center">
								<a
									href="https://t.me/matfocus"
									target="_blank"
									rel="noopener noreferrer"
									className="flex items-center p-3 rounded-md hover:bg-gray-100 transition-colors"
								>
									{/* SVG иконка Telegram */}
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="24"
										height="24"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										strokeWidth="2"
										strokeLinecap="round"
										strokeLinejoin="round"
										className="text-blue-500"
									>
										<path d="M21.5 4.5L2.5 12.5L21.5 20.5L21.5 16.5L11.5 12.5L21.5 8.5Z"></path>
									</svg>
									<span className="ml-2">@matfocus</span>
								</a>
							</div>
						</div>
					</div>

					{/* Правая колонка с формой обратной связи */}
					<div className="bg-white rounded-lg shadow-sm p-6">
						<h2 className="text-2xl font-semibold mb-6">Напишите нам</h2>
						<p className="text-gray-600 mb-8">
							Заполните форму, и мы свяжемся с вами в ближайшее время. Мы всегда
							рады ответить на ваши вопросы!
						</p>

						<ContactForm />
					</div>
				</div>
			</div>
		</div>
	)
}
