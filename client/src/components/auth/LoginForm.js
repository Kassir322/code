'use client'

import { useState, useEffect, Suspense } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Eye, EyeOff, Mail, Lock, AlertCircle, CheckCircle } from 'lucide-react'
import cookiesService from '@/services/cookies' // Импортируем новый сервис

// Схема валидации для формы входа
const loginSchema = z.object({
	identifier: z
		.string()
		.min(1, { message: 'Введите email или имя пользователя' }),
	password: z.string().min(1, { message: 'Введите пароль' }),
	rememberMe: z.boolean().optional(),
})

function LoginFormContent() {
	const [showPassword, setShowPassword] = useState(false)
	const [isLoading, setIsLoading] = useState(false)
	const [serverError, setServerError] = useState(null)
	const [registrationSuccess, setRegistrationSuccess] = useState(false)

	const router = useRouter()
	const searchParams = useSearchParams()

	// Проверяем, был ли пользователь только что зарегистрирован
	useEffect(() => {
		const registered = searchParams.get('registered')
		if (registered === 'true') {
			setRegistrationSuccess(true)

			// Через 5 секунд скрываем сообщение об успешной регистрации
			const timer = setTimeout(() => {
				setRegistrationSuccess(false)
			}, 5000)

			return () => clearTimeout(timer)
		}
	}, [searchParams])

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm({
		resolver: zodResolver(loginSchema),
		defaultValues: {
			identifier: '',
			password: '',
			rememberMe: false,
		},
	})

	const onSubmit = async (data) => {
		console.log('submit')

		setIsLoading(true)
		setServerError(null)

		try {
			const apiUrl = `${
				process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1337'
			}/api/auth/local`

			const response = await fetch(apiUrl, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					identifier: data.identifier,
					password: data.password,
				}),
			})

			const result = await response.json()
			console.log(result)

			if (!response.ok) {
				throw new Error(
					result.error?.message ||
						'Неверные учетные данные. Пожалуйста, проверьте email и пароль.'
				)
			}

			// Сохраняем данные пользователя в localStorage
			localStorage.setItem('user', JSON.stringify(result.user))

			// Используем cookiesService для установки токена
			cookiesService.setAuthToken(result.jwt)

			// Проверяем, есть ли параметр redirect в URL
			const redirect = searchParams.get('redirect') || '/account'

			// Перенаправляем пользователя
			router.push(redirect)
		} catch (error) {
			console.error('Ошибка при входе:', error)
			setServerError(
				error.message ||
					'Неверные учетные данные. Пожалуйста, проверьте email и пароль.'
			)
		} finally {
			setIsLoading(false)
		}
	}

	const togglePasswordVisibility = () => {
		setShowPassword(!showPassword)
	}

	return (
		<div className="max-w-md w-full mx-auto bg-white rounded-lg shadow-sm p-8">
			<h2 className="text-2xl font-bold text-center mb-6">Вход в аккаунт</h2>

			{registrationSuccess && (
				<div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-md flex items-start">
					<CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
					<p>Регистрация прошла успешно! Теперь вы можете войти в аккаунт.</p>
				</div>
			)}

			{serverError && (
				<div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md flex items-start">
					<AlertCircle className="h-5 w-5 text-red-500 mt-0.5 mr-2 flex-shrink-0" />
					<p>{serverError}</p>
				</div>
			)}

			<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
				{/* Email или имя пользователя */}
				<div>
					<label
						htmlFor="identifier"
						className="block text-sm font-medium text-gray-700 mb-1"
					>
						Email или имя пользователя
					</label>
					<div className="relative">
						<div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
							<Mail className="h-5 w-5 text-gray-400" />
						</div>
						<input
							id="identifier"
							type="text"
							{...register('identifier')}
							className={`w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
								errors.identifier
									? 'border-red-300 focus:ring-red-200'
									: 'border-gray-300 focus:ring-primary-200'
							}`}
							placeholder="Введите email или имя пользователя"
						/>
					</div>
					{errors.identifier && (
						<p className="mt-1 text-sm text-red-600">
							{errors.identifier.message}
						</p>
					)}
				</div>

				{/* Пароль */}
				<div>
					<div className="flex justify-between items-center mb-1">
						<label
							htmlFor="password"
							className="block text-sm font-medium text-gray-700"
						>
							Пароль
						</label>
						<Link
							href="/account/forgot-password"
							className="text-sm text-secondary-blue hover:underline"
						>
							Забыли пароль?
						</Link>
					</div>
					<div className="relative">
						<div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
							<Lock className="h-5 w-5 text-gray-400" />
						</div>
						<input
							id="password"
							type={showPassword ? 'text' : 'password'}
							{...register('password')}
							className={`w-full pl-10 pr-10 py-2 border rounded-md focus:outline-none focus:ring-2 ${
								errors.password
									? 'border-red-300 focus:ring-red-200'
									: 'border-gray-300 focus:ring-primary-200'
							}`}
							placeholder="Введите пароль"
						/>
						<div className="absolute inset-y-0 right-0 flex items-center pr-3">
							<button
								type="button"
								onClick={togglePasswordVisibility}
								className="text-gray-400 hover:text-gray-600 focus:outline-none cursor-pointer"
							>
								{showPassword ? (
									<EyeOff className="h-5 w-5" />
								) : (
									<Eye className="h-5 w-5" />
								)}
							</button>
						</div>
					</div>
					{errors.password && (
						<p className="mt-1 text-sm text-red-600">
							{errors.password.message}
						</p>
					)}
				</div>

				{/* Запомнить меня */}
				<div className="flex items-center">
					<input
						id="rememberMe"
						type="checkbox"
						{...register('rememberMe')}
						className="h-4 w-4 text-secondary-blue focus:ring-secondary-blue border-gray-300 rounded cursor-pointer"
					/>
					<label
						htmlFor="rememberMe"
						className="ml-2 block text-sm text-gray-700 cursor-pointer"
					>
						Запомнить меня
					</label>
				</div>

				{/* Кнопка отправки */}
				<div>
					<button
						type="submit"
						disabled={isLoading}
						className="w-full bg-secondary-blue text-white py-2 px-4 rounded-md font-medium hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed cursor-pointer"
					>
						{isLoading ? 'Вход...' : 'Войти'}
					</button>
				</div>
			</form>

			{/* Разделитель */}
			<div className="my-6 flex items-center">
				<div className="flex-grow border-t border-gray-300"></div>
				<div className="flex-grow border-t border-gray-300"></div>
			</div>

			{/* Ссылка на страницу регистрации */}
			<div className="mt-4 text-center">
				<p className="text-sm text-gray-600">
					Еще нет аккаунта?{' '}
					<Link
						href="/account/register"
						className="text-secondary-blue hover:underline font-medium"
					>
						Зарегистрироваться
					</Link>
				</p>
			</div>
		</div>
	)
}

export default function LoginForm() {
	return (
		<Suspense fallback={<div>Загрузка...</div>}>
			<LoginFormContent />
		</Suspense>
	)
}
