import React from 'react'
import { BookOpen, Brain, Award } from 'lucide-react'

const benefits = [
	{
		title: 'Структурированная информация',
		description:
			'Материал подобран и организован профессиональными педагогами для максимально эффективного усвоения. Каждая карточка содержит самую важную информацию по теме, что помогает быстрее запомнить ключевые концепции.',
		icon: BookOpen,
	},
	{
		title: 'Удобный формат для запоминания',
		description:
			'Двусторонние карточки позволяют быстро проверить знания и закрепить материал. Формат вопрос-ответ или шпаргалки помогает эффективно усваивать информацию благодаря активному повторению.',
		icon: Brain,
	},
	{
		title: 'Проверенная методология',
		description:
			'Наш подход основан на научных методах запоминания и проверен тысячами учеников. Мы используем принципы интервального повторения и активного обучения, которые доказали свою эффективность в педагогической практике.',
		icon: Award,
	},
]

export default function BenefitsSection() {
	return (
		<section className="py-16 bg-white">
			<div className="container mx-auto px-4">
				<h2 className="text-3xl font-bold text-center mb-12">
					Преимущества наших учебных карточек
				</h2>

				<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
					{benefits.map((benefit, index) => (
						<div
							key={index}
							className="flex flex-col items-center text-center p-6 rounded-lg bg-white shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
						>
							<div className="bg-primary-light rounded-full p-4 mb-4">
								<benefit.icon className="h-8 w-8 text-primary" />
							</div>
							<h3 className="text-xl font-semibold mb-3">{benefit.title}</h3>
							<p className="text-gray-600">{benefit.description}</p>
						</div>
					))}
				</div>
			</div>
		</section>
	)
}
