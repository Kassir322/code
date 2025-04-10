// src/components/product/ProductTrustBlock.js
import React from 'react'
import Link from 'next/link'
import {
	ArrowRight,
	BookOpen,
	Truck,
	CreditCard,
	ShieldCheck,
} from 'lucide-react'

export default function ProductTrustBlock() {
	// Массив с преимуществами компании
	const benefits = [
		{
			icon: BookOpen,
			title: 'Экспертный подход',
			description:
				'Наши материалы разрабатываются профессиональными педагогами с многолетним опытом',
		},
		{
			icon: Truck,
			title: 'Доставка по всей России',
			description:
				'Отправляем заказы во все регионы через надежные службы доставки',
		},
		{
			icon: CreditCard,
			title: 'Удобная оплата',
			description:
				'Принимаем онлайн-платежи, банковские карты и другие способы оплаты',
		},
		{
			icon: ShieldCheck,
			title: 'Гарантия качества',
			description:
				'Мы уверены в качестве наших материалов и готовы вернуть деньги, если вам не понравится',
		},
	]

	return (
		<div className="bg-white rounded-lg shadow-sm p-6 my-8">
			<h2 className="text-xl font-semibold mb-6">Почему стоит купить у нас?</h2>

			<div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
				{benefits.map((benefit, index) => (
					<div
						key={index}
						className="flex items-start border border-gray-100 rounded-lg p-4 hover:shadow-md transition-shadow"
					>
						<div className="bg-primary-light rounded-full p-2 mr-4 flex-shrink-0">
							<benefit.icon className="h-5 w-5 text-secondary-blue" />
						</div>
						<div>
							<h3 className="font-medium mb-1">{benefit.title}</h3>
							<p className="text-sm text-gray-600">{benefit.description}</p>
						</div>
					</div>
				))}
			</div>

			<div className="mt-6 pt-4 border-t border-gray-100 text-center">
				<p className="text-gray-700 mb-3">
					Mat-Focus — команда профессионалов, создающих высококачественные
					учебные материалы для эффективного обучения.
				</p>
				<Link
					href="/about"
					className="inline-flex items-center text-secondary-blue hover:underline font-medium transition-colors cursor-pointer"
				>
					Узнать больше о нас
					<ArrowRight className="ml-1 h-4 w-4" />
				</Link>
			</div>
		</div>
	)
}
