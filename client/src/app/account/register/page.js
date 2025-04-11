import RegisterForm from '@/components/auth/RegisterForm'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import Breadcrumbs from '@/components/Breadcrumbs'

// Метаданные для SEO
export const metadata = {
	title: 'Регистрация | Mat-Focus',
	description:
		'Создайте аккаунт на сайте Mat-Focus, чтобы получить доступ к личному кабинету и возможность отслеживать ваши заказы.',
	keywords:
		'регистрация, создать аккаунт, mat-focus, учебные материалы, личный кабинет',
}

export default function RegisterPage() {
	// Хлебные крошки для улучшения навигации и SEO
	const breadcrumbItems = [
		{ name: 'Главная', url: '/' },
		{ name: 'Аккаунт', url: '/account' },
		{ name: 'Регистрация', url: '/account/register' },
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
						<h2 className="text-xl font-semibold mb-4">
							Преимущества регистрации
						</h2>
						<ul className="space-y-3">
							<li className="flex items-start">
								<span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-secondary-blue text-white text-xs font-medium mr-2 mt-0.5">
									1
								</span>
								<p className="text-gray-700">
									Отслеживание статуса заказов в реальном времени
								</p>
							</li>
							<li className="flex items-start">
								<span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-secondary-blue text-white text-xs font-medium mr-2 mt-0.5">
									2
								</span>
								<p className="text-gray-700">Сохранение истории покупок</p>
							</li>
							<li className="flex items-start">
								<span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-secondary-blue text-white text-xs font-medium mr-2 mt-0.5">
									3
								</span>
								<p className="text-gray-700">
									Быстрое оформление заказов без повторного ввода данных
								</p>
							</li>
							<li className="flex items-start">
								<span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-secondary-blue text-white text-xs font-medium mr-2 mt-0.5">
									4
								</span>
								<p className="text-gray-700">
									Доступ к специальным акциям и скидкам для зарегистрированных
									пользователей
								</p>
							</li>
						</ul>
					</div>

					{/* Форма регистрации */}
					<div className="md:col-span-2">
						<RegisterForm />
					</div>
				</div>
			</div>
		</div>
	)
}
