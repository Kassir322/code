'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Link from 'next/link'
import Breadcrumbs from '@/components/Breadcrumbs'
import { ArrowLeft, Mail, AlertCircle, CheckCircle } from 'lucide-react'

// Схема валидации для формы восстановления пароля
const forgotPasswordSchema = z.object({
	email: z.string().email({ message: 'Введите корректный email адрес' }),
})

export default function ForgotPasswordPage() {
	const [isLoading, setIsLoading] = useState(false)
	const [requestSent, setRequestSent] = useState(false)
	const [serverError, setServerError] = useState(null)

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm({
		resolver: zodResolver(forgotPasswordSchema),
		defaultValues: {
			email: '',
		},
	})

	const onSubmit = async (data) => {
		setIsLoading(true)
		setServerError(null)

		try {
			// В будущем здесь будет интеграция с API
			// const response = await fetch('/api/auth/forgot-password', {
			//   method: 'POST',
			//   headers: { 'Content-Type': 'application/json' },
			//   body: JSON.stringify({
			//     email: data.email,
			//   }),
			// })

			// Эмуляция ответа сервера
			await new Promise((resolve) => setTimeout(resolve, 1000))

			setRequestSent(true)
		} catch (error) {
			console.error('Ошибка при восстановлении пароля:', error)
			setServerError(
				'Произошла ошибка при отправке запроса. Пожалуйста, попробуйте позже.'
			)
		} finally {
			setIsLoading(false)
		}
	}

	// Хлебные крошки для улучшения навигации и SEO
	const breadcrumbItems = [
		{ name: 'Главная', url: '/' },
		{ name: 'Аккаунт', url: '/account' },
		{ name: 'Восстановление пароля', url: '/account/forgot-password' },
	]

	return (
		<div className="container mx-auto px-4 mt-24 mb-16">
			{/* Хлебные крошки */}
			<Breadcrumbs items={breadcrumbItems} />

			{/* Ссылка назад */}
			<div className="mb-6">
				<Link
					href="/account/login"
					className="inline-flex items-center text-secondary-blue hover:underline"
				>
					<ArrowLeft className="h-4 w-4 mr-1" />
					<span>Назад к входу</span>
				</Link>
			</div>

			<div className="max-w-md mx-auto">
				<div className="bg-white rounded-lg shadow-sm p-8">
					<h1 className="text-2xl font-bold text-center mb-6">
						Восстановление пароля
					</h1>

					{requestSent ? (
						/* Сообщение об успешной отправке */
						<div className="text-center">
							<div className="flex justify-center mb-4">
								<div className="rounded-full bg-green-100 p-3">
									<CheckCircle className="h-8 w-8 text-green-600" />
								</div>
							</div>
							<h2 className="text-xl font-semibold mb-3">
								Инструкции отправлены
							</h2>
							<p className="text-gray-600 mb-6">
								Мы отправили инструкции по восстановлению пароля на указанный
								email. Пожалуйста, проверьте свою почту и следуйте инструкциям в
								письме.
							</p>
							<p className="text-gray-600 mb-6">
								Не получили письмо? Проверьте папку "Спам" или попробуйте
								<button
									className="text-secondary-blue hover:underline ml-1 cursor-pointer"
									onClick={() => setRequestSent(false)}
								>
									отправить запрос снова
								</button>
							</p>
							<Link
								href="/account/login"
								className="inline-block bg-secondary-blue text-white py-2 px-4 rounded-md font-medium hover:bg-blue-700 transition-colors cursor-pointer"
							>
								Вернуться ко входу
							</Link>
						</div>
					) : (
						/* Форма восстановления пароля */
						<>
							<p className="text-gray-600 mb-6 text-center">
								Введите email, указанный при регистрации, и мы отправим вам
								инструкции по восстановлению пароля.
							</p>

							{serverError && (
								<div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md flex items-start">
									<AlertCircle className="h-5 w-5 text-red-500 mt-0.5 mr-2 flex-shrink-0" />
									<p>{serverError}</p>
								</div>
							)}

							<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
								{/* Email */}
								<div>
									<label
										htmlFor="email"
										className="block text-sm font-medium text-gray-700 mb-1"
									>
										Email
									</label>
									<div className="relative">
										<div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
											<Mail className="h-5 w-5 text-gray-400" />
										</div>
										<input
											id="email"
											type="email"
											{...register('email')}
											className={`w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
												errors.email
													? 'border-red-300 focus:ring-red-200'
													: 'border-gray-300 focus:ring-primary-200'
											}`}
											placeholder="Введите ваш email"
										/>
									</div>
									{errors.email && (
										<p className="mt-1 text-sm text-red-600">
											{errors.email.message}
										</p>
									)}
								</div>

								{/* Кнопка отправки */}
								<div>
									<button
										type="submit"
										disabled={isLoading}
										className="w-full bg-secondary-blue text-white py-2 px-4 rounded-md font-medium hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed cursor-pointer"
									>
										{isLoading ? 'Отправка...' : 'Отправить инструкции'}
									</button>
								</div>
							</form>

							<div className="mt-6 text-center">
								<p className="text-sm text-gray-600">
									Вспомнили пароль?{' '}
									<Link
										href="/account/login"
										className="text-secondary-blue hover:underline font-medium"
									>
										Войти
									</Link>
								</p>
							</div>
						</>
					)}
				</div>
			</div>
		</div>
	)
}
