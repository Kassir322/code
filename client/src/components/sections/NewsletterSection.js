'use client'

import React, { useState } from 'react'
import { Mail, Check, AlertCircle } from 'lucide-react'

export default function NewsletterSection() {
	const [email, setEmail] = useState('')
	const [status, setStatus] = useState(null) // null, 'success', 'error'

	const handleSubmit = (e) => {
		e.preventDefault()

		// Простая валидация email
		if (!email || !email.includes('@') || !email.includes('.')) {
			setStatus('error')
			return
		}

		// Здесь в будущем будет API для подписки
		// Пока просто имитируем успешный запрос
		setTimeout(() => {
			setStatus('success')
			setEmail('')

			// Сбрасываем статус через 5 секунд
			setTimeout(() => {
				setStatus(null)
			}, 5000)
		}, 1000)
	}

	return (
		<section className="py-16 bg-primary-light">
			<div className="container mx-auto px-4">
				<div className="max-w-3xl mx-auto bg-white rounded-xl shadow-sm p-8 relative overflow-hidden">
					{/* Декоративный элемент */}
					<div className="absolute -top-10 -right-10 w-40 h-40 bg-primary-light opacity-50 rounded-full z-0"></div>

					<div className="relative z-10">
						<div className="flex flex-col md:flex-row items-center">
							<div className="flex-shrink-0 mb-6 md:mb-0 md:mr-8">
								<div className="bg-primary-light p-4 rounded-full inline-block">
									<Mail className="h-10 w-10 text-primary" />
								</div>
							</div>

							<div className="flex-grow">
								<h3 className="text-2xl font-bold mb-2">
									Будьте в курсе новинок
								</h3>
								<p className="text-gray-600 mb-6">
									Подпишитесь на рассылку и получайте информацию о новых учебных
									материалах, полезные советы по обучению и эксклюзивные скидки
								</p>

								<form
									onSubmit={handleSubmit}
									className="flex flex-col sm:flex-row gap-3"
								>
									<div className="flex-grow relative">
										<input
											type="email"
											value={email}
											onChange={(e) => setEmail(e.target.value)}
											placeholder="Ваш email"
											className={`w-full px-4 py-3 rounded-md border ${
												status === 'error'
													? 'border-red-400 focus:border-red-500 focus:ring-red-500'
													: 'border-gray-300 focus:border-primary focus:ring-primary'
											} focus:outline-none focus:ring-2 focus:ring-opacity-50`}
											required
										/>
										{status === 'error' && (
											<div className="absolute inset-y-0 right-0 flex items-center pr-3">
												<AlertCircle className="h-5 w-5 text-red-500" />
											</div>
										)}
									</div>

									<button
										type="submit"
										className={`cursor-pointer px-6 py-3 rounded-md font-medium transition-colors ${
											status === 'success'
												? 'bg-green-500 hover:bg-green-600 text-white'
												: 'bg-primary hover:bg-primary-dark text-white'
										}`}
									>
										{status === 'success' ? (
											<>
												<Check className="inline-block mr-2 h-5 w-5" />
												Отправлено
											</>
										) : (
											'Подписаться'
										)}
									</button>
								</form>

								{status === 'error' && (
									<p className="mt-2 text-sm text-red-600">
										Пожалуйста, введите корректный email адрес
									</p>
								)}

								{status === 'success' && (
									<p className="mt-2 text-sm text-green-600">
										Спасибо за подписку! Мы отправили вам письмо для
										подтверждения.
									</p>
								)}
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	)
}
