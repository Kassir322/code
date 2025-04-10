import Link from 'next/link'
import Image from 'next/image'
import { Mail } from 'lucide-react'
import LegalLinks from '@/components/layout/LegalLinks'

export default function Footer() {
	return (
		<footer className="bg-slate-50 pt-16 border-t border-gray-300">
			<div className="container mx-auto px-4">
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 xl:px-20 max-w-80 md:max-w-none mx-auto">
					{/* Первая колонка с логотипом и описанием */}
					<div className="xl:max-w-2xs">
						<Link href="/" className="flex items-center mb-4">
							<div className="mr-2">
								<Image
									src="/images/logo.svg"
									alt="Mat-Focus Логотип"
									width={40}
									height={40}
								/>
							</div>
							<span className="text-xl font-bold">MatFocus</span>
						</Link>
						<p className="text-gray-600 mb-4 max-w-2xs md:max-w-none">
							Мы создаем эффективные учебные карточки для школьников и
							студентов. Наши материалы помогут в подготовке к экзаменам и
							улучшении успеваемости.
						</p>

						{/* Социальные сети */}
						{/* <div className="flex space-x-4 mt-4">
							<Link href="https://facebook.com" aria-label="Facebook">
								<div className="text-gray-500 hover:text-primary transition-colors">
									<svg
										className="w-5 h-5"
										fill="currentColor"
										viewBox="0 0 24 24"
									>
										<path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
									</svg>
								</div>
							</Link>
							<Link href="https://twitter.com" aria-label="Twitter">
								<div className="text-gray-500 hover:text-primary transition-colors">
									<svg
										className="w-5 h-5"
										fill="currentColor"
										viewBox="0 0 24 24"
									>
										<path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
									</svg>
								</div>
							</Link>
							<Link href="https://youtube.com" aria-label="YouTube">
								<div className="text-gray-500 hover:text-primary transition-colors">
									<svg
										className="w-5 h-5"
										fill="currentColor"
										viewBox="0 0 24 24"
									>
										<path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
									</svg>
								</div>
							</Link>
							<Link href="https://linkedin.com" aria-label="LinkedIn">
								<div className="text-gray-500 hover:text-primary transition-colors">
									<svg
										className="w-5 h-5"
										fill="currentColor"
										viewBox="0 0 24 24"
									>
										<path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
									</svg>
								</div>
							</Link>
						</div> */}
					</div>

					{/* Вторая колонка: Полезные ссылки */}
					<div>
						<h3 className="text-lg font-semibold mb-4">Полезные ссылки</h3>
						<ul className="space-y-2">
							<li>
								<Link
									href="/contact"
									className="text-gray-600 hover:text-primary transition-colors"
								>
									Контакты
								</Link>
							</li>
							<li>
								<Link
									href="/about"
									className="text-gray-600 hover:text-primary transition-colors"
								>
									О компании
								</Link>
							</li>
							<li>
								<Link
									href="/customer-service"
									className="text-gray-600 hover:text-primary transition-colors"
								>
									Служба поддержки
								</Link>
							</li>
							<li>
								<Link
									href="/faq"
									className="text-gray-600 hover:text-primary transition-colors"
								>
									Часто задаваемые вопросы
								</Link>
							</li>
						</ul>
					</div>

					{/* Добавьте новую колонку для юридических документов */}
					<div>
						<h3 className="text-lg font-semibold mb-4">Правовая информация</h3>
						<LegalLinks />
					</div>

					{/* Третья колонка: Подписка на рассылку */}
					<div>
						<h3 className="text-lg font-semibold mb-4">Подписка на новости</h3>
						<p className="text-gray-600 mb-4 max-w-2xs md:max-w-none">
							Получайте информацию о новых учебных материалах, акциях и полезных
							советах
						</p>
						<form className="flex mt-2 gap-0.5 max-w-2xs md:max-w-none">
							<input
								type="email"
								placeholder="Ваш email"
								className="px-4 py-2 border border-gray-300 rounded-l-md w-full focus:outline-none focus:ring-1 focus:ring-primary placeholder:text-neutral-500"
								required
							/>
							<button
								type="submit"
								className="flex items-center justify-center border cursor-pointer border-gray-300 hover:bg-neutral-06 text-white px-4 py-2 rounded-r-md hover:bg-primary-dark transition-colors "
								aria-label="Подписаться"
							>
								<Mail color="#99B6FF" className="h-5 w-5" />
							</button>
						</form>
					</div>
				</div>

				{/* Нижняя часть с копирайтом */}
				<div className="border-t border-gray-200 mt-12 pb-4 pt-4 text-center text-gray-500">
					<p>© {new Date().getFullYear()} Mat-Focus. Все права защищены.</p>
				</div>
			</div>
		</footer>
	)
}
