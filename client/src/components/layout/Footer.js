import Link from 'next/link'
import Image from 'next/image'
import MyButton from '../ui/LinkButton'
export default function Footer() {
	return (
		<footer className="bg-primary pt-12 pb-8 border-t border-gray-200">
			<div className="container mx-auto px-4">
				<div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-neutral-03">
					{/* Колонка 1: Логотип и описание */}
					<div>
						<Link href="/" className="flex items-center mb-4">
							<div className="mr-2">
								<Image
									src="/images/logo.svg"
									alt="Mat-Focus Логотип"
									width={40}
									height={40}
									className="w-10 h-10"
								/>
							</div>
							<span className="text-xl font-bold">MatFocus</span>
						</Link>
						<p className=" mb-4">
							Mat-Focus — это магазин учебных карточек для эффективного
							обучения. Получите необходимые материалы для обучения из нашего
							магазина.
						</p>

						{/* Форма подписки на рассылку */}
						<div className="mt-4">
							<h4 className="font-medium mb-2">Подпишитесь на рассылку</h4>
							<div className="flex">
								<input
									type="email"
									placeholder="Ваш email"
									className="px-3 py-2 border border-neutral-01 rounded-l-md focus:outline-none focus:ring-1 focus:ring-primary w-full"
								/>
								<button className="bg-white text-black px-4 py-2 rounded-r-full    hover:bg-neutral-500 transition-colors">
									Подписаться
								</button>
							</div>
						</div>
					</div>

					{/* Колонка 2: Компания */}
					<div>
						<h3 className="font-bold text-lg mb-4 ">Компания</h3>
						<ul className="space-y-2">
							<li>
								<Link
									href="/about"
									className="text-gray-600 hover:text-primary"
								>
									О нас
								</Link>
							</li>
							<li>
								<Link
									href="/delivery"
									className="text-gray-600 hover:text-primary"
								>
									Доставка
								</Link>
							</li>
							<li>
								<Link
									href="/terms"
									className="text-gray-600 hover:text-primary"
								>
									Условия использования
								</Link>
							</li>
							<li>
								<Link
									href="/payments"
									className="text-gray-600 hover:text-primary"
								>
									Способы оплаты
								</Link>
							</li>
							<li>
								<Link
									href="/privacy"
									className="text-gray-600 hover:text-primary"
								>
									Политика конфиденциальности
								</Link>
							</li>
						</ul>
					</div>

					{/* Колонка 3: Аккаунт */}
					<div>
						<h3 className="font-bold text-lg mb-4">Аккаунт</h3>
						<ul className="space-y-2">
							<li>
								<Link
									href="/account/login"
									className="text-gray-600 hover:text-primary"
								>
									Войти
								</Link>
							</li>
							<li>
								<Link href="/cart" className="text-gray-600 hover:text-primary">
									Корзина
								</Link>
							</li>
							<li>
								<Link
									href="/account/orders"
									className="text-gray-600 hover:text-primary"
								>
									История заказов
								</Link>
							</li>
							<li>
								<Link
									href="/wishlist"
									className="text-gray-600 hover:text-primary"
								>
									Избранное
								</Link>
							</li>
						</ul>
					</div>

					{/* Колонка 4: Контакты */}
					<div>
						<h3 className="font-bold text-lg mb-4">Контакты</h3>
						<ul className="space-y-3">
							<li className="flex items-start">
								<div className="mr-2 mt-1 text-primary">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										className="h-5 w-5"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
										/>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
										/>
									</svg>
								</div>
								<span className="text-gray-600">г. Ставрополь, Россия</span>
							</li>
							<li className="flex items-start">
								<div className="mr-2 mt-1 text-primary">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										className="h-5 w-5"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
										/>
									</svg>
								</div>
								<span className="text-gray-600">control@mat-focus.ru</span>
							</li>
							<li className="flex items-start">
								<div className="mr-2 mt-1 text-primary">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										className="h-5 w-5"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
										/>
									</svg>
								</div>
								<span className="text-gray-600">8 988 866 12 76</span>
							</li>

							{/* Социальные сети */}
							<li className="pt-2">
								<h4 className="font-medium mb-2">Мы в соцсетях</h4>
								<div className="flex space-x-3">
									<a
										href="https://t.me/matfocus"
										target="_blank"
										rel="noopener noreferrer"
										className="bg-gray-200 hover:bg-primary hover:text-white p-2 rounded-full transition-colors"
									>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											width="20"
											height="20"
											fill="currentColor"
											viewBox="0 0 24 24"
										>
											<path d="M12 0c-6.626 0-12 5.372-12 12 0 6.627 5.374 12 12 12 6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12zm-1.218 19.618c-.371.037-.712-.029-1.004-.181-.276-.143-.544-.312-.802-.498-.87-.64-1.466-1.487-1.806-2.504-.203-.608-.304-1.238-.254-1.881.044-.572.015-1.147.058-1.72.035-.47.195-.91.517-1.263.304-.333.698-.522 1.151-.566.361-.037.731-.043 1.089.028.432.085.786.313 1.016.701.138.232.229.485.298.748.05.193.08.394.09.584-.035.043-.063.093-.107.127-.471.367-.943.736-1.416 1.101-.096.074-.194.145-.282.229-.114.111-.128.251-.041.379.196.292.49.399.823.389.155-.005.3-.08.436-.155.073-.04.14-.09.207-.136.413-.3.827-.598 1.236-.901.1-.073.182-.07.276.006.306.248.617.488.921.738.142.118.324.22.343.424.023.253-.017.495-.137.723-.157.3-.394.443-.72.505zm5.326-8.475c-.039.048-.085.084-.133.119-1.248.885-2.493 1.771-3.743 2.653-.178.125-.353.253-.534.375-.23.156-.511.127-.794.04-.17-.053-.3-.138-.388-.294-.078-.138-.123-.288-.156-.443-.113-.548-.226-1.095-.337-1.642-.016-.076-.025-.15-.062-.219-.063-.116-.055-.293.087-.348.088-.034.184-.045.277-.067l.744-.166c1.707-.38 3.415-.76 5.121-1.142.131-.029.262-.064.397-.072.216-.012.322.14.284.35-.037.200-.088.394-.158.585-.166.448-.356.883-.605 1.271z" />
										</svg>
									</a>

									{/* Дополнительные иконки соцсетей можно добавить по аналогии */}
								</div>
							</li>
						</ul>
					</div>
				</div>

				{/* Копирайт */}
				<div className="border-t border-gray-200 mt-8 pt-6 text-center text-gray-500 text-sm">
					<p>© {new Date().getFullYear()} Mat-Focus. Все права защищены.</p>
				</div>
			</div>
		</footer>
	)
}
