'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, User, Mail, Lock, AlertCircle } from 'lucide-react'
import cookiesService from '@/lib/cookies'
import { useAuth } from '@/hooks/useAuth' // Импортируем хук useAuth

// Схема валидации для формы регистрации
const registerSchema = z
	.object({
		username: z
			.string()
			.min(3, {
				message: 'Имя пользователя должно содержать не менее 3 символов',
			})
			.max(50, {
				message: 'Имя пользователя должно содержать не более 50 символов',
			}),
		email: z.string().email({ message: 'Введите корректный email адрес' }),
		password: z
			.string()
			.min(6, { message: 'Пароль должен содержать не менее 6 символов' })
			.regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
				message:
					'Пароль должен содержать хотя бы одну заглавную букву, одну строчную букву и одну цифру',
			}),
		confirmPassword: z.string(),
		privacyPolicy: z.boolean().refine((val) => val === true, {
			message: 'Вы должны согласиться с политикой конфиденциальности',
		}),
		termsOfService: z.boolean().refine((val) => val === true, {
			message: 'Вы должны согласиться с условиями использования',
		}),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: 'Пароли не совпадают',
		path: ['confirmPassword'],
	})

export default function RegisterForm() {
	const router = useRouter() // Инициализируем router
	const [showPassword, setShowPassword] = useState(false)
	const [showConfirmPassword, setShowConfirmPassword] = useState(false)
	const [serverError, setServerError] = useState(null)

	// Используем кастомный хук для авторизации
	const {
		register: registerUser,
		isLoading,
		error: authError,
		resetError,
	} = useAuth()

	useEffect(() => {
		// Устанавливаем ошибку авторизации из Redux, если она есть
		if (authError) {
			setServerError(authError)
		}

		// Очищаем ошибку при размонтировании компонента
		return () => {
			resetError()
		}
	}, [authError, resetError])

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm({
		resolver: zodResolver(registerSchema),
		defaultValues: {
			username: '',
			email: '',
			password: '',
			confirmPassword: '',
			privacyPolicy: false,
			termsOfService: false,
		},
	})

	const onSubmit = async (data) => {
		setServerError(null)

		try {
			// Вызываем реальный API для регистрации
			const response = await fetch(
				`${
					process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1337'
				}/api/auth/local/register`,
				{
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({
						username: data.username,
						email: data.email,
						password: data.password,
					}),
				}
			)

			const result = await response.json()

			if (!response.ok) {
				throw new Error(
					result.error?.message ||
						'Произошла ошибка при регистрации. Пожалуйста, попробуйте позже.'
				)
			}

			if (result.jwt) {
				// Сохраняем данные пользователя в localStorage
				localStorage.setItem('user', JSON.stringify(result.user))

				// Используем cookiesService для установки токена
				cookiesService.setAuthToken(result.jwt)

				// Перенаправляем на страницу аккаунта или другую страницу
				router.push('/account')
			}

			// Перенаправляем на страницу входа с флагом успешной регистрации
			router.push('/account/login?registered=true')
		} catch (error) {
			console.error('Ошибка при регистрации:', error)
			setServerError(
				error.message ||
					'Произошла ошибка при регистрации. Пожалуйста, попробуйте позже.'
			)
		}
	}

	const togglePasswordVisibility = () => {
		setShowPassword(!showPassword)
	}

	const toggleConfirmPasswordVisibility = () => {
		setShowConfirmPassword(!showConfirmPassword)
	}

	return (
		<div className="max-w-md w-full mx-auto bg-white rounded-lg shadow-sm p-8">
			<h2 className="text-2xl font-bold text-center mb-6">Регистрация</h2>

			{serverError && (
				<div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md flex items-start">
					<AlertCircle className="h-5 w-5 text-red-500 mt-0.5 mr-2 flex-shrink-0" />
					<p>{serverError}</p>
				</div>
			)}

			<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
				{/* Имя пользователя */}
				<div>
					<label
						htmlFor="username"
						className="block text-sm font-medium text-gray-700 mb-1"
					>
						Имя пользователя*
					</label>
					<div className="relative">
						<div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
							<User className="h-5 w-5 text-gray-400" />
						</div>
						<input
							id="username"
							type="text"
							{...register('username')}
							className={`w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
								errors.username
									? 'border-red-300 focus:ring-red-200'
									: 'border-gray-300 focus:ring-primary-200'
							}`}
							placeholder="Введите имя пользователя"
						/>
					</div>
					{errors.username && (
						<p className="mt-1 text-sm text-red-600">
							{errors.username.message}
						</p>
					)}
				</div>

				{/* Email */}
				<div>
					<label
						htmlFor="email"
						className="block text-sm font-medium text-gray-700 mb-1"
					>
						Email*
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
							placeholder="Введите email"
						/>
					</div>
					{errors.email && (
						<p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
					)}
				</div>

				{/* Пароль */}
				<div>
					<label
						htmlFor="password"
						className="block text-sm font-medium text-gray-700 mb-1"
					>
						Пароль*
					</label>
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

				{/* Подтверждение пароля */}
				<div>
					<label
						htmlFor="confirmPassword"
						className="block text-sm font-medium text-gray-700 mb-1"
					>
						Подтверждение пароля*
					</label>
					<div className="relative">
						<div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
							<Lock className="h-5 w-5 text-gray-400" />
						</div>
						<input
							id="confirmPassword"
							type={showConfirmPassword ? 'text' : 'password'}
							{...register('confirmPassword')}
							className={`w-full pl-10 pr-10 py-2 border rounded-md focus:outline-none focus:ring-2 ${
								errors.confirmPassword
									? 'border-red-300 focus:ring-red-200'
									: 'border-gray-300 focus:ring-primary-200'
							}`}
							placeholder="Подтвердите пароль"
						/>
						<div className="absolute inset-y-0 right-0 flex items-center pr-3">
							<button
								type="button"
								onClick={toggleConfirmPasswordVisibility}
								className="text-gray-400 hover:text-gray-600 focus:outline-none cursor-pointer"
							>
								{showConfirmPassword ? (
									<EyeOff className="h-5 w-5" />
								) : (
									<Eye className="h-5 w-5" />
								)}
							</button>
						</div>
					</div>
					{errors.confirmPassword && (
						<p className="mt-1 text-sm text-red-600">
							{errors.confirmPassword.message}
						</p>
					)}
				</div>

				{/* Соглашения */}
				<div className="space-y-3">
					<div className="flex items-start">
						<div className="flex h-5 items-center">
							<input
								id="privacyPolicy"
								type="checkbox"
								{...register('privacyPolicy')}
								className={`h-4 w-4 rounded border-gray-300 text-secondary-blue focus:ring-secondary-blue cursor-pointer ${
									errors.privacyPolicy ? 'border-red-300' : ''
								}`}
							/>
						</div>
						<div className="ml-3 text-sm">
							<label
								htmlFor="privacyPolicy"
								className="font-medium text-gray-700 cursor-pointer"
							>
								Согласие с политикой конфиденциальности *
							</label>
							<p className="text-gray-500">
								Я согласен с{' '}
								<Link
									href="/legal/privacy-policy"
									className="text-secondary-blue hover:underline"
								>
									политикой конфиденциальности
								</Link>
							</p>
							{errors.privacyPolicy && (
								<p className="mt-1 text-sm text-red-600">
									{errors.privacyPolicy.message}
								</p>
							)}
						</div>
					</div>

					<div className="flex items-start">
						<div className="flex h-5 items-center">
							<input
								id="termsOfService"
								type="checkbox"
								{...register('termsOfService')}
								className={`h-4 w-4 rounded border-gray-300 text-secondary-blue focus:ring-secondary-blue cursor-pointer ${
									errors.termsOfService ? 'border-red-300' : ''
								}`}
							/>
						</div>
						<div className="ml-3 text-sm">
							<label
								htmlFor="termsOfService"
								className="font-medium text-gray-700 cursor-pointer"
							>
								Согласие с правилами пользования *
							</label>
							<p className="text-gray-500">
								Я согласен с{' '}
								<Link
									href="/legal/terms-of-use"
									className="text-secondary-blue hover:underline"
								>
									правилами пользования сайтом
								</Link>
							</p>
							{errors.termsOfService && (
								<p className="mt-1 text-sm text-red-600">
									{errors.termsOfService.message}
								</p>
							)}
						</div>
					</div>
				</div>

				{/* Кнопка отправки */}
				<div>
					<button
						type="submit"
						disabled={isLoading}
						className="w-full bg-secondary-blue text-white py-2 px-4 rounded-md font-medium hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed cursor-pointer"
					>
						{isLoading ? 'Регистрация...' : 'Зарегистрироваться'}
					</button>
				</div>
			</form>

			{/* Ссылка на страницу входа */}
			<div className="mt-4 text-center">
				<p className="text-sm text-gray-600">
					Уже есть аккаунт?{' '}
					<Link
						href="/account/login"
						className="text-secondary-blue hover:underline font-medium"
					>
						Войти
					</Link>
				</p>
			</div>
		</div>
	)
}
