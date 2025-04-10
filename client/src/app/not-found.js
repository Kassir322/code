// app/not-found.js
import Link from 'next/link'
import Image from 'next/image'
import { BookX, Home, Search, ShoppingCart, ArrowLeft } from 'lucide-react'
import BackButton from '@/components/ui/BackButton'
import SearchForm from '@/components/ui/SearchForm'

export const metadata = {
	title: 'Страница не найдена | Mat-Focus',
	description:
		'Извините, страница, которую вы ищете, не существует. Найдите нужные учебные материалы в нашем каталоге.',
	robots: {
		index: false,
		follow: true,
	},
}

export default function NotFound() {
	return (
		<div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-[70vh]">
			<div className="w-full max-w-3xl bg-white rounded-lg shadow-sm p-8 text-center">
				{/* Иконка ошибки */}
				<div className="flex justify-center mb-6">
					<div className="relative w-32 h-32 md:w-40 md:h-40">
						<div className="absolute inset-0 bg-primary-light rounded-full flex items-center justify-center">
							<BookX className="h-16 w-16 md:h-20 md:w-20 text-secondary-blue" />
						</div>
					</div>
				</div>

				{/* Текст ошибки */}
				<h1 className="text-3xl md:text-4xl font-bold mb-4">
					Страница не найдена
				</h1>
				<p className="text-gray-600 mb-8 max-w-lg mx-auto">
					Упс! Похоже, мы не смогли найти нужную вам страницу. Возможно, она
					была перемещена или удалена, или вы перешли по неверной ссылке.
				</p>

				{/* Поисковая форма */}
				<SearchForm />

				{/* Кнопки для навигации */}
				<div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
					<Link
						href="/"
						className="flex items-center justify-center bg-dark text-white rounded-md py-3 px-6 hover:bg-hover transition-colors cursor-pointer"
					>
						<Home className="mr-2 h-5 w-5" />
						На главную
					</Link>

					<Link
						href="/catalog"
						className="flex items-center justify-center bg-secondary-blue text-white rounded-md py-3 px-6 hover:bg-blue-700 transition-colors cursor-pointer"
					>
						<ShoppingCart className="mr-2 h-5 w-5" />
						Перейти в каталог
					</Link>

					<BackButton />
				</div>

				{/* Популярные категории */}
				<div className="border-t border-gray-200 pt-6">
					<h3 className="text-lg font-medium mb-4">Популярные категории:</h3>
					<div className="flex flex-wrap justify-center gap-2">
						<Link
							href="/catalog/mathematics"
							className="px-4 py-2 bg-primary-light text-primary rounded-md hover:bg-blue-100 transition-colors cursor-pointer"
						>
							Математика
						</Link>
						<Link
							href="/catalog/russian-language"
							className="px-4 py-2 bg-primary-light text-primary rounded-md hover:bg-blue-100 transition-colors cursor-pointer"
						>
							Русский язык
						</Link>
						<Link
							href="/catalog/physics"
							className="px-4 py-2 bg-primary-light text-primary rounded-md hover:bg-blue-100 transition-colors cursor-pointer"
						>
							Физика
						</Link>
						<Link
							href="/catalog/english-language"
							className="px-4 py-2 bg-primary-light text-primary rounded-md hover:bg-blue-100 transition-colors cursor-pointer"
						>
							Английский язык
						</Link>
						<Link
							href="/catalog/biology"
							className="px-4 py-2 bg-primary-light text-primary rounded-md hover:bg-blue-100 transition-colors cursor-pointer"
						>
							Биология
						</Link>
					</div>
				</div>
			</div>

			{/* Дополнительная помощь */}
			<div className="mt-6 text-center">
				<p className="text-gray-600">
					Нужна помощь?{' '}
					<Link href="/contact" className="text-secondary-blue hover:underline">
						Свяжитесь с нами
					</Link>
				</p>
			</div>
		</div>
	)
}
