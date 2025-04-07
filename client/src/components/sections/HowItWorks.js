import React from 'react'
import { ShoppingCart, Package, Sparkles, BookOpenCheck } from 'lucide-react'

const steps = [
	{
		title: 'Выберите набор',
		description:
			'Подберите карточки по предмету и формату (вопрос-ответ, шпаргалка или комбинированный). У нас есть материалы для разных классов и разных уровней подготовки.',
		icon: ShoppingCart,
	},
	{
		title: 'Оформите заказ',
		description:
			'Укажите адрес доставки и выберите удобный способ оплаты. Мы принимаем различные способы оплаты, включая онлайн-платежи и оплату при получении.',
		icon: BookOpenCheck,
	},
	{
		title: 'Получите коробку',
		description:
			'Мы доставим ваши карточки в надежной упаковке. Каждый набор включает прочную коробку для хранения и использования карточек, что защитит их от повреждений.',
		icon: Package,
	},
	{
		title: 'Начните обучение',
		description:
			'Используйте карточки для эффективного изучения и закрепления материала. Регулярные занятия с карточками помогут быстрее усвоить информацию и улучшить результаты в учебе.',
		icon: Sparkles,
	},
]

export default function HowItWorks() {
	return (
		<section className="py-16 ">
			<div className="container mx-auto px-4">
				<h2 className="text-3xl font-bold text-center mb-12">
					Как это работает
				</h2>

				<div className="relative max-w-6xl mx-auto">
					{/* Линия соединяющая шаги (только на десктопе) */}
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
						{steps.map((step, index) => (
							<div
								key={index}
								className="relative flex flex-col items-center text-center"
							>
								{/* Круг с номером и иконкой */}
								<div className="relative z-10 bg-white rounded-full h-16 w-16 flex items-center justify-center border-2 border-primary mb-4 shadow-sm">
									<div className="bg-primary-light rounded-full p-3">
										<step.icon className="h-6 w-6" />
									</div>
									{/* Номер шага (маленький круг с цифрой) */}
									<div className="absolute top-0 -right-3  bg-secondary-blue text-white rounded-full h-6 w-6 flex items-center justify-center text-xs font-bold z-20">
										{index + 1}
									</div>
								</div>

								{/* Текст шага */}
								<div className="bg-white p-4 rounded-lg shadow-sm z-10 w-full h-full">
									<h3 className="text-lg font-semibold mb-2">{step.title}</h3>
									<p className="text-neutral-04 text-base">
										{step.description}
									</p>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
		</section>
	)
}
