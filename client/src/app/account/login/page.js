import LoginForm from '@/components/auth/LoginForm'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import Breadcrumbs from '@/components/Breadcrumbs'

// Метаданные для SEO
export const metadata = {
	title: 'Вход в аккаунт | Mat-Focus',
	description:
		'Войдите в личный кабинет на сайте Mat-Focus для управления заказами и доступа к истории покупок.',
	keywords:
		'вход в аккаунт, авторизация, mat-focus, учебные материалы, личный кабинет',
}

export default function LoginPage() {
	// Хлебные крошки для улучшения навигации и SEO
	const breadcrumbItems = [
		{ name: 'Главная', url: '/' },
		{ name: 'Аккаунт', url: '/account' },
		{ name: 'Вход', url: '/account/login' },
	]

	return (
		<div className="container mx-auto px-4 mt-24 mb-16">
			{/* Хлебные крошки */}
			<Breadcrumbs items={breadcrumbItems} />

			{/* Ссылка назад */}
			<div className="mb-6">
				<Link
					href="/"
					className="inline-flex items-center text-secondary-blue hover:underline"
				>
					<ArrowLeft className="h-4 w-4 mr-1" />
					<span>Назад на главную</span>
				</Link>
			</div>

			<div className="max-w-4xl mx-auto">
				<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
					{/* Информационная панель */}
					<div className="hidden md:block md:col-span-1 bg-primary-light rounded-lg p-6">
						<h2 className="text-xl font-semibold mb-4">Добро пожаловать!</h2>
						<p className="text-gray-700 mb-4">
							Войдите в личный кабинет, чтобы получить доступ к следующим
							возможностям:
						</p>
						<ul className="space-y-3">
							<li className="flex items-start">
								<span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-secondary-blue text-white text-xs font-medium mr-2 mt-0.5">
									→
								</span>
								<p className="text-gray-700">Просмотр статуса заказов</p>
							</li>
							<li className="flex items-start">
								<span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-secondary-blue text-white text-xs font-medium mr-2 mt-0.5">
									→
								</span>
								<p className="text-gray-700">История покупок</p>
							</li>
							<li className="flex items-start">
								<span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-secondary-blue text-white text-xs font-medium mr-2 mt-0.5">
									→
								</span>
								<p className="text-gray-700">Управление личными данными</p>
							</li>
							<li className="flex items-start">
								<span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-secondary-blue text-white text-xs font-medium mr-2 mt-0.5">
									→
								</span>
								<p className="text-gray-700">Сохранение избранных товаров</p>
							</li>
						</ul>
						<div className="mt-6 text-center">
							<Link
								href="/account/register"
								className="text-secondary-blue hover:underline font-medium"
							>
								Ещё нет аккаунта? Зарегистрироваться
							</Link>
						</div>
					</div>

					{/* Форма входа */}
					<div className="md:col-span-2">
						<LoginForm />
					</div>
				</div>
			</div>
		</div>
	)
}
