// client/src/app/legal/page.js
import React from 'react'
import Link from 'next/link'
import Breadcrumbs from '@/components/Breadcrumbs'
import { FileText, Shield, BookOpen } from 'lucide-react'

export const metadata = {
	title: 'Правовая информация | Mat-Focus',
	description:
		'Юридические документы интернет-магазина учебных материалов Mat-Focus: договор публичной оферты, политика конфиденциальности, правила пользования сайтом.',
	keywords:
		'правовая информация, юридические документы, оферта, конфиденциальность, mat-focus',
	alternates: {
		canonical: 'https://mat-focus.ru/legal',
	},
}

export default function LegalIndexPage() {
	// Данные для хлебных крошек
	const breadcrumbItems = [
		{ name: 'Главная', url: '/' },
		{ name: 'Правовая информация', url: '/legal' },
	]

	// Список юридических документов
	const legalDocuments = [
		{
			title: 'Договор публичной оферты',
			description:
				'Условия покупки учебных материалов, права и обязанности покупателя и продавца, правила доставки и возврата товаров.',
			url: '/legal/public-offer',
			icon: FileText,
			color: 'bg-blue-100',
			textColor: 'text-blue-600',
		},
		{
			title: 'Политика конфиденциальности',
			description:
				'Правила обработки и защиты персональных данных пользователей, использование файлов cookies, права пользователей.',
			url: '/legal/privacy-policy',
			icon: Shield,
			color: 'bg-green-100',
			textColor: 'text-green-600',
		},
		{
			title: 'Правила пользования сайтом',
			description:
				'Правила использования сайта интернет-магазина, авторские права на контент, ограничения и ответственность сторон.',
			url: '/legal/terms-of-use',
			icon: BookOpen,
			color: 'bg-purple-100',
			textColor: 'text-purple-600',
		},
	]

	return (
		<div className="container mx-auto px-4 mt-24 mb-16">
			{/* Хлебные крошки */}
			<Breadcrumbs items={breadcrumbItems} />

			<div className="bg-white rounded-lg shadow-sm p-6 my-8">
				<h1 className="text-3xl font-bold mb-6">Правовая информация</h1>

				<p className="text-gray-600 mb-8">
					На этой странице вы найдете правовые документы, регулирующие отношения
					между интернет-магазином Mat-Focus и пользователями сайта. Мы
					рекомендуем ознакомиться с этими документами перед использованием
					наших услуг.
				</p>

				<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
					{legalDocuments.map((doc, index) => (
						<Link
							key={index}
							href={doc.url}
							className="block p-6 rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all"
						>
							<div
								className={`${doc.color} p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4`}
							>
								<doc.icon className={`h-6 w-6 ${doc.textColor}`} />
							</div>
							<h2 className="text-xl font-semibold mb-2">{doc.title}</h2>
							<p className="text-gray-600">{doc.description}</p>
							<div className={`mt-4 ${doc.textColor} font-medium`}>
								Читать документ →
							</div>
						</Link>
					))}
				</div>

				<div className="mt-10 bg-neutral-02 rounded-lg p-6">
					<h2 className="text-xl font-semibold mb-4">Контактная информация</h2>
					<p className="text-gray-600 mb-2">
						Если у вас возникли вопросы относительно правовых документов или
						использования наших услуг, вы можете связаться с нами:
					</p>
					<ul className="list-disc pl-6 text-gray-600 space-y-1">
						<li>
							По электронной почте:{' '}
							<a
								href="mailto:control@mat-focus.ru"
								className="text-secondary-blue hover:underline"
							>
								control@mat-focus.ru
							</a>
						</li>
						<li>
							По телефону:{' '}
							<a
								href="tel:+79888661276"
								className="text-secondary-blue hover:underline"
							>
								8 988 866 12 76
							</a>
						</li>
						<li>
							Через форму обратной связи на странице{' '}
							<Link
								href="/contact"
								className="text-secondary-blue hover:underline"
							>
								Контакты
							</Link>
						</li>
					</ul>
				</div>
			</div>
		</div>
	)
}
