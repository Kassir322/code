'use client'
// src/components/product/ProductTabs.js (обновленный)
import { useState } from 'react'
import Tab from '@/components/product/Tab'

export default function ProductTabs({ product }) {
	const [activeTab, setActiveTab] = useState('description')

	const { description, subject, card_type, number_of_cards, grade } = product

	// Количество отзывов (в реальном приложении будет из API)
	const reviewCount = product.reviewCount || 0

	// Обработчик клика по вкладке с прокруткой страницы
	const handleTabClick = (tabId) => {
		setActiveTab(tabId)
		// Плавная прокрутка к верхней части вкладок
		window.scrollTo({
			top: document.getElementById('product-tabs')?.offsetTop - 100 || 0,
			behavior: 'smooth',
		})
	}

	return (
		<div id="product-tabs" className="bg-white rounded-lg shadow-sm p-6 my-8">
			<div className="border-b border-gray-200">
				<div className="flex flex-wrap -mb-px">
					<Tab
						id="description"
						label="Описание"
						active={activeTab === 'description'}
						onClick={() => handleTabClick('description')}
					/>
					<Tab
						id="details"
						label="Характеристики"
						active={activeTab === 'details'}
						onClick={() => handleTabClick('details')}
					/>
					<Tab
						id="delivery"
						label="Доставка и оплата"
						active={activeTab === 'delivery'}
						onClick={() => handleTabClick('delivery')}
					/>
					{/* <Tab
						id="faq"
						label="Вопросы и ответы"
						active={activeTab === 'faq'}
						onClick={() => handleTabClick('faq')}
					/> */}
					{/* <Tab
						id="reviews"
						label={
							<span className="flex items-center">
								Отзывы
								{reviewCount > 0 && (
									<span className="ml-1 bg-secondary-blue text-white rounded-full text-xs px-2 py-0.5">
										{reviewCount}
									</span>
								)}
							</span>
						}
						active={activeTab === 'reviews'}
						onClick={() => handleTabClick('reviews')}
					/> */}
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

				{/* {activeTab === 'faq' && (
					<div className="prose max-w-none">
						<h3 className="text-xl font-semibold mb-4">
							Часто задаваемые вопросы
						</h3>

						<div className="space-y-4">
							<div className="border-b border-gray-200 pb-4">
								<h4 className="font-medium">Из чего изготовлены карточки?</h4>
								<p className="text-gray-700 mt-2">
									Наши учебные карточки изготовлены из плотного картона
									премиум-класса (300 г/м²), что обеспечивает их долговечность и
									устойчивость к износу. Они покрыты ламинацией для защиты от
									влаги и загрязнений.
								</p>
							</div>

							<div className="border-b border-gray-200 pb-4">
								<h4 className="font-medium">
									Как быстро осуществляется доставка?
								</h4>
								<p className="text-gray-700 mt-2">
									Отправка заказа происходит в течение 1-2 рабочих дней после
									его оформления. Сроки доставки зависят от выбранного вами
									способа: СДЭК – 2-7 дней, Почта России – 3-10 дней, Boxberry –
									2-7 дней, 5Post – 3-7 дней.
								</p>
							</div>

							<div className="border-b border-gray-200 pb-4">
								<h4 className="font-medium">
									Можно ли вернуть товар, если он не подошел?
								</h4>
								<p className="text-gray-700 mt-2">
									Да, вы можете вернуть товар в течение 14 дней с момента
									получения, если он сохранил товарный вид, потребительские
									свойства и не имеет следов использования. Обратите внимание,
									что по закону учебные материалы относятся к товарам
									надлежащего качества, которые не подлежат возврату, если они
									не имеют недостатков.
								</p>
							</div>

							<div className="border-b border-gray-200 pb-4">
								<h4 className="font-medium">
									Как правильно заниматься с карточками?
								</h4>
								<p className="text-gray-700 mt-2">
									Мы рекомендуем использовать метод интервального повторения:
									изучите карточки, затем повторите их через 1 день, затем через
									3 дня, затем через неделю. Также эффективен метод активного
									вспоминания: просмотрите вопрос, попытайтесь вспомнить ответ,
									а затем проверьте себя, перевернув карточку.
								</p>
							</div>
						</div>
					</div>
				)} */}
			</div>
		</div>
	)
}
