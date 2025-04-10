'use client'

// src/components/product/ProductFAQ.js
import React, { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'

export default function ProductFAQ() {
	// Статические данные для FAQ
	const faqItems = [
		{
			question: 'Из чего изготовлены карточки?',
			answer:
				'Наши учебные карточки изготовлены из плотного картона премиум-класса (300 г/м²), что обеспечивает их долговечность и устойчивость к износу. Они покрыты ламинацией для защиты от влаги и загрязнений.',
		},
		{
			question: 'Как быстро осуществляется доставка?',
			answer:
				'Отправка заказа происходит в течение 1-2 рабочих дней после его оформления. Сроки доставки зависят от выбранного вами способа: СДЭК – 2-7 дней, Почта России – 3-10 дней, Boxberry – 2-7 дней, 5Post – 3-7 дней.',
		},
		{
			question: 'Можно ли вернуть товар, если он не подошел?',
			answer:
				'Да, вы можете вернуть товар в течение 14 дней с момента получения, если он сохранил товарный вид, потребительские свойства и не имеет следов использования. Обратите внимание, что по закону учебные материалы относятся к товарам надлежащего качества, которые не подлежат возврату, если они не имеют недостатков.',
		},
		{
			question: 'Как правильно заниматься с карточками?',
			answer:
				'Мы рекомендуем использовать метод интервального повторения: изучите карточки, затем повторите их через 1 день, затем через 3 дня, затем через неделю. Также эффективен метод активного вспоминания: просмотрите вопрос, попытайтесь вспомнить ответ, а затем проверьте себя, перевернув карточку.',
		},
		{
			question: 'Подходят ли карточки для подготовки к ОГЭ/ЕГЭ?',
			answer:
				'Да, мы разрабатываем специальные наборы для подготовки к ОГЭ и ЕГЭ по различным предметам. Эти карточки содержат информацию, соответствующую требованиям экзаменов, и помогут систематизировать знания и эффективно подготовиться к тестированию.',
		},
		{
			question: 'Есть ли скидки при покупке нескольких наборов?',
			answer:
				'Да, при покупке 3-х и более наборов карточек действует скидка 10%. Скидка применяется автоматически при оформлении заказа.',
		},
	]

	// Состояние для отслеживания открытых вопросов
	const [openIndex, setOpenIndex] = useState(null)

	// Функция для переключения открытого вопроса
	const toggleQuestion = (index) => {
		setOpenIndex(openIndex === index ? null : index)
	}

	return (
		<div className="bg-white rounded-lg shadow-sm p-6 my-8">
			<h2 className="text-2xl font-semibold mb-6">Часто задаваемые вопросы</h2>

			<div className="divide-y divide-gray-200">
				{faqItems.map((item, index) => (
					<div key={index} className="py-4">
						<button
							onClick={() => toggleQuestion(index)}
							className="flex justify-between items-center w-full text-left focus:outline-none"
							aria-expanded={openIndex === index}
						>
							<h3 className="text-lg font-medium text-gray-900">
								{item.question}
							</h3>
							<span className="ml-6 flex-shrink-0">
								{openIndex === index ? (
									<ChevronUp className="h-5 w-5 text-secondary-blue" />
								) : (
									<ChevronDown className="h-5 w-5 text-gray-500" />
								)}
							</span>
						</button>

						{openIndex === index && (
							<div className="mt-2 pr-12">
								<p className="text-gray-700">{item.answer}</p>
							</div>
						)}
					</div>
				))}
			</div>
		</div>
	)
}
