'use client'
// src/components/product/ProductTabs.js
import { useState } from 'react'
import Tab from '@/components/product/Tab'
import ProductReviews from '@/components/product/ProductReviews'

export default function ProductTabs({ product }) {
	const [activeTab, setActiveTab] = useState('description')

	const { description, subject, card_type, number_of_cards, grade } = product

	// Количество отзывов (в реальном приложении будет из API)
	const reviewCount = product.reviewCount || 0

	return (
		<div className="bg-white rounded-lg shadow-sm p-6 my-8">
			<div className="border-b border-gray-200">
				<div className="flex flex-wrap -mb-px">
					<Tab
						id="description"
						label="Описание"
						active={activeTab === 'description'}
						onClick={() => setActiveTab('description')}
					/>
					<Tab
						id="details"
						label="Характеристики"
						active={activeTab === 'details'}
						onClick={() => setActiveTab('details')}
					/>
					<Tab
						id="delivery"
						label="Доставка и оплата"
						active={activeTab === 'delivery'}
						onClick={() => setActiveTab('delivery')}
					/>
					<Tab
						id="reviews"
						label={`Отзывы${reviewCount > 0 ? ` (${reviewCount})` : ''}`}
						active={activeTab === 'reviews'}
						onClick={() => setActiveTab('reviews')}
					/>
				</div>
			</div>

			<div className="py-4">
				{activeTab === 'description' && (
					<div className="prose max-w-none">
						<p className="text-gray-700">
							{description ||
								`Учебные карточки ${product.name} помогут структурировать знания и сделают процесс обучения более эффективным. Идеальное решение для подготовки к экзаменам и освоения новых тем.`}
						</p>
						<p className="text-gray-700 mt-4">
							Карточки созданы опытными педагогами и методистами, содержат самую
							важную информацию для успешного изучения предмета. Удобный формат
							позволяет быстро запоминать ключевые концепции и формулы.
						</p>
						<p className="text-gray-700 mt-4">
							Материал подходит для самостоятельного изучения и повторения
							пройденного в школе. Карточки можно использовать как в классе, так
							и дома, они компактны и удобны в использовании.
						</p>
					</div>
				)}

				{activeTab === 'details' && (
					<div className="prose max-w-none">
						<h3 className="text-xl font-semibold mb-4">
							Технические характеристики
						</h3>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div className="border-b border-gray-200 py-2">
								<span className="text-gray-600">Предмет:</span>
								<span className="ml-2 font-medium">
									{subject || 'Не указан'}
								</span>
							</div>
							<div className="border-b border-gray-200 py-2">
								<span className="text-gray-600">Класс:</span>
								<span className="ml-2 font-medium">{grade || 'Не указан'}</span>
							</div>
							<div className="border-b border-gray-200 py-2">
								<span className="text-gray-600">Тип карточек:</span>
								<span className="ml-2 font-medium">
									{card_type || 'Не указан'}
								</span>
							</div>
							<div className="border-b border-gray-200 py-2">
								<span className="text-gray-600">Количество в наборе:</span>
								<span className="ml-2 font-medium">
									{number_of_cards || 'Не указано'} шт.
								</span>
							</div>
							<div className="border-b border-gray-200 py-2">
								<span className="text-gray-600">Материал:</span>
								<span className="ml-2 font-medium">Плотный картон</span>
							</div>
							<div className="border-b border-gray-200 py-2">
								<span className="text-gray-600">Размер карточки:</span>
								<span className="ml-2 font-medium">9 × 12 см</span>
							</div>
							<div className="border-b border-gray-200 py-2">
								<span className="text-gray-600">Вес набора:</span>
								<span className="ml-2 font-medium">200 г</span>
							</div>
							<div className="border-b border-gray-200 py-2">
								<span className="text-gray-600">Производитель:</span>
								<span className="ml-2 font-medium">Mat-Focus</span>
							</div>
						</div>
					</div>
				)}

				{activeTab === 'delivery' && (
					<div className="prose max-w-none">
						<h3 className="text-xl font-semibold mb-4">Доставка</h3>
						<p className="text-gray-700">
							Мы доставляем заказы по всей России с помощью надежных партнеров:
						</p>
						<ul className="mt-2 space-y-2">
							<li className="flex items-center">
								<span className="w-32 text-gray-600">СДЭК:</span>
								<span>от 250 ₽, срок 2-7 дней</span>
							</li>
							<li className="flex items-center">
								<span className="w-32 text-gray-600">Почта России:</span>
								<span>от 250 ₽, срок 3-10 дней</span>
							</li>
							<li className="flex items-center">
								<span className="w-32 text-gray-600">5post:</span>
								<span>от 270 ₽, срок 3-7 дней</span>
							</li>
							<li className="flex items-center">
								<span className="w-32 text-gray-600">Boxberry:</span>
								<span>от 280 ₽, срок 2-7 дней</span>
							</li>
						</ul>

						<h3 className="text-xl font-semibold mt-6 mb-4">Оплата</h3>
						<p className="text-gray-700">
							Мы принимаем различные способы оплаты:
						</p>
						<ul className="mt-2 space-y-2">
							<li className="flex items-center">
								<span className="w-32 text-gray-600">Онлайн:</span>
								<span>Банковские карты, СБП, ЮKassa</span>
							</li>
							<li className="flex items-center">
								<span className="w-32 text-gray-600">При получении:</span>
								<span>
									Наличными или картой (при доставке СДЭК или Boxberry)
								</span>
							</li>
						</ul>
					</div>
				)}

				{activeTab === 'reviews' && <ProductReviews productId={product.id} />}
			</div>
		</div>
	)
}
