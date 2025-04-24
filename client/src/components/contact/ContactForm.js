'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Send, CheckCircle, AlertCircle } from 'lucide-react'

// Создаем схему валидации с помощью Zod
const contactFormSchema = z.object({
	name: z
		.string()
		.min(2, { message: 'Имя должно содержать не менее 2 символов' }),
	email: z.string().email({ message: 'Введите корректный email адрес' }),
	phone: z
		.string()
		.regex(/^(\+7|8)?[\s\-]?\(?\d{3}\)?[\s\-]?\d{3}[\s\-]?\d{2}[\s\-]?\d{2}$/, {
			message: 'Введите корректный российский номер телефона',
		})
		.optional()
		.or(z.literal('')),
	subject: z
		.string()
		.min(5, { message: 'Тема должна содержать не менее 5 символов' }),
	message: z
		.string()
		.min(10, { message: 'Сообщение должно содержать не менее 10 символов' }),
	privacy: z.boolean().refine((val) => val === true, {
		message: 'Вы должны согласиться с политикой конфиденциальности',
	}),
})

export default function ContactForm() {
	// Состояния для отображения результата отправки
	const [isSubmitting, setIsSubmitting] = useState(false)
	const [submitSuccess, setSubmitSuccess] = useState(false)
	const [submitError, setSubmitError] = useState(false)
	const [errorMessage, setErrorMessage] = useState('')

	// Используем React Hook Form с Zod валидацией
	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm({
		resolver: zodResolver(contactFormSchema),
		defaultValues: {
			name: '',
			email: '',
			phone: '',
			subject: '',
			message: '',
			privacy: false,
		},
	})

	// Обработчик отправки формы
	const onSubmit = async (data) => {
		// Отладочная инфа
		setIsSubmitting(true)
		setSubmitSuccess(false)
		setSubmitError(false)

		try {
			// В реальном приложении здесь будет вызов API для отправки данных
			// const response = await fetch('/api/contact', {
			//   method: 'POST',
			//   headers: { 'Content-Type': 'application/json' },
			//   body: JSON.stringify(data),
			// });

			// Имитация задержки ответа от сервера
			await new Promise((resolve) => setTimeout(resolve, 1000))

			// Имитация успешного ответа сервера
			const success = true

			if (success) {
				setSubmitSuccess(true)
				reset() // Сбрасываем форму после успешной отправки
			} else {
				throw new Error('Не удалось отправить сообщение')
			}
		} catch (error) {
			setSubmitError(true)
			setErrorMessage(
				error.message || 'Произошла ошибка при отправке сообщения'
			)
			console.error('Ошибка отправки формы:', error)
		} finally {
			setIsSubmitting(false)
		}
	}

	useEffect(() => {
		if (Object.keys(errors).length > 0) {
			console.log('Form errors:', errors)
		}
	}, [errors])

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
			{/* Сообщение об успешной отправке */}
			{submitSuccess && (
				<div className="bg-green-50 border border-green-200 text-green-800 rounded-md p-4 mb-6 flex items-start">
					<CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-2" />
					<div>
						<p className="font-medium">Спасибо за ваше сообщение!</p>
						<p className="mt-1">Мы ответим вам в ближайшее время.</p>
					</div>
				</div>
			)}

			{/* Сообщение об ошибке */}
			{submitError && (
				<div className="bg-red-50 border border-red-200 text-red-800 rounded-md p-4 mb-6 flex items-start">
					<AlertCircle className="h-5 w-5 text-red-500 mt-0.5 mr-2" />
					<div>
						<p className="font-medium">Ошибка отправки сообщения</p>
						<p className="mt-1">
							{errorMessage || 'Пожалуйста, попробуйте позже'}
						</p>
					</div>
				</div>
			)}

			{/* Поля формы */}
			<div>
				<label
					htmlFor="name"
					className="block text-sm font-medium text-gray-700 mb-1"
				>
					Имя *
				</label>
				<input
					type="text"
					id="name"
					{...register('name')}
					className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
						errors.name
							? 'border-red-500 focus:ring-red-500'
							: 'border-gray-300'
					}`}
					placeholder="Ваше имя"
				/>
				{errors.name && (
					<p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
				)}
			</div>

			<div>
				<label
					htmlFor="email"
					className="block text-sm font-medium text-gray-700 mb-1"
				>
					Email *
				</label>
				<input
					type="email"
					id="email"
					{...register('email')}
					className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
						errors.email
							? 'border-red-500 focus:ring-red-500'
							: 'border-gray-300'
					}`}
					placeholder="your@email.com"
				/>
				{errors.email && (
					<p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
				)}
			</div>

			<div>
				<label
					htmlFor="phone"
					className="block text-sm font-medium text-gray-700 mb-1"
				>
					Телефон
				</label>
				<input
					type="tel"
					id="phone"
					{...register('phone')}
					className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
						errors.phone
							? 'border-red-500 focus:ring-red-500'
							: 'border-gray-300'
					}`}
					placeholder="+7 (___) ___-__-__"
				/>
				{errors.phone && (
					<p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
				)}
			</div>

			<div>
				<label
					htmlFor="subject"
					className="block text-sm font-medium text-gray-700 mb-1"
				>
					Тема *
				</label>
				<input
					type="text"
					id="subject"
					{...register('subject')}
					className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
						errors.subject
							? 'border-red-500 focus:ring-red-500'
							: 'border-gray-300'
					}`}
					placeholder="Тема сообщения"
				/>
				{errors.subject && (
					<p className="mt-1 text-sm text-red-600">{errors.subject.message}</p>
				)}
			</div>

			<div>
				<label
					htmlFor="message"
					className="block text-sm font-medium text-gray-700 mb-1"
				>
					Сообщение *
				</label>
				<textarea
					id="message"
					{...register('message')}
					rows="5"
					className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
						errors.message
							? 'border-red-500 focus:ring-red-500'
							: 'border-gray-300'
					}`}
					placeholder="Ваше сообщение"
				></textarea>
				{errors.message && (
					<p className="mt-1 text-sm text-red-600">{errors.message.message}</p>
				)}
			</div>

			<div className="flex items-start">
				<div className="flex items-center h-5">
					<input
						id="privacy"
						type="checkbox"
						{...register('privacy')}
						className={`h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary ${
							errors.privacy ? 'border-red-500' : ''
						}`}
					/>
				</div>
				<div className="ml-3 text-sm">
					<label htmlFor="privacy" className="font-medium text-gray-700">
						Согласие на обработку персональных данных *
					</label>
					<p className="text-gray-500">
						Я согласен с{' '}
						<a
							href="/privacy-policy"
							className="text-secondary-blue hover:underline"
							target="_blank"
							rel="noopener noreferrer"
						>
							политикой конфиденциальности
						</a>
					</p>
					{errors.privacy && (
						<p className="mt-1 text-sm text-red-600">
							{errors.privacy.message}
						</p>
					)}
				</div>
			</div>

			<button
				type="submit"
				disabled={isSubmitting}
				className="w-full bg-dark hover:bg-hover text-white py-3 px-6 rounded-md font-medium flex items-center justify-center transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed cursor-pointer"
			>
				{isSubmitting ? (
					<>
						<svg
							className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
						>
							<circle
								className="opacity-25"
								cx="12"
								cy="12"
								r="10"
								stroke="currentColor"
								strokeWidth="4"
							></circle>
							<path
								className="opacity-75"
								fill="currentColor"
								d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
							></path>
						</svg>
						Отправка...
					</>
				) : (
					<>
						<Send className="h-5 w-5 mr-2" />
						Отправить сообщение
					</>
				)}
			</button>
		</form>
	)
}
