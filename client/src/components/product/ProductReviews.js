'use client'
// src/components/product/ProductReviews.js
import { useState, useEffect } from 'react'
import { Star, ThumbsUp, Reply } from 'lucide-react'
import Image from 'next/image'

// Функция для получения отзывов (заглушка, в реальном приложении будет API-запрос)
const fetchReviews = async (productId, page = 1, limit = 3) => {
	// В реальном приложении здесь будет запрос к API
	// const response = await fetch(`/api/products/${productId}/reviews?page=${page}&limit=${limit}`);
	// return await response.json();

	// Заглушка для демонстрации
	const mockReviews = [
		{
			id: 1,
			authorName: 'Анна В.',
			authorAvatar: '/images/avatar1.jpg',
			rating: 5,
			date: '12.03.2025',
			comment:
				'Отличные карточки! Моему ребенку очень понравились. Помогли быстро подготовиться к контрольной работе. Будем заказывать еще для других предметов.',
		},
		{
			id: 2,
			authorName: 'Михаил К.',
			authorAvatar: '/images/avatar2.jpg',
			rating: 4,
			date: '05.03.2025',
			comment:
				'Хорошее качество печати, удобный формат. Единственное, хотелось бы больше примеров. В целом, доволен покупкой.',
		},
		{
			id: 3,
			authorName: 'Елена Д.',
			authorAvatar: '/images/avatar3.jpg',
			rating: 5,
			date: '28.02.2025',
			comment:
				'Карточки очень помогли моей дочери подготовиться к экзаменам. Удобно, что можно брать с собой куда угодно и заниматься в любую свободную минуту. Обязательно закажем ещё для подготовки к следующему году.',
		},
		{
			id: 4,
			authorName: 'Сергей П.',
			authorAvatar: '/images/avatar4.jpg',
			rating: 4,
			date: '20.02.2025',
			comment:
				'Качественный материал, приятно держать в руках. Информация структурирована, легко запоминается.',
		},
		{
			id: 5,
			authorName: 'Татьяна Н.',
			authorAvatar: '/images/avatar5.jpg',
			rating: 5,
			date: '15.02.2025',
			comment:
				'Очень довольна покупкой! Сын использует карточки каждый день, заметно улучшились оценки в школе.',
		},
		{
			id: 6,
			authorName: 'Александр И.',
			authorAvatar: '/images/avatar6.jpg',
			rating: 3,
			date: '10.02.2025',
			comment:
				'Карточки неплохие, но некоторая информация уже устарела. Было бы здорово обновить содержание.',
		},
		{
			id: 7,
			authorName: 'Ольга М.',
			authorAvatar: '/images/avatar7.jpg',
			rating: 5,
			date: '05.02.2025',
			comment:
				'Идеальный формат для подготовки! Использую сама для повторения материала перед преподаванием.',
		},
	]

	// Имитация пагинации
	const total = mockReviews.length
	const startIndex = (page - 1) * limit
	const endIndex = Math.min(startIndex + limit, total)

	return {
		data: mockReviews.slice(startIndex, endIndex),
		meta: {
			currentPage: page,
			totalPages: Math.ceil(total / limit),
			totalItems: total,
		},
	}
}

export default function ProductReviews({ productId }) {
	const [reviews, setReviews] = useState([])
	const [meta, setMeta] = useState({
		currentPage: 1,
		totalPages: 1,
		totalItems: 0,
	})
	const [loading, setLoading] = useState(true)
	const [currentPage, setCurrentPage] = useState(1)
	const [sort, setSort] = useState('newest')

	// Загрузка отзывов
	useEffect(() => {
		const loadReviews = async () => {
			setLoading(true)
			try {
				const response = await fetchReviews(productId, currentPage, 3) // 3 отзыва на страницу
				setReviews(response.data)
				setMeta(response.meta)
			} catch (error) {
				console.error('Ошибка при загрузке отзывов:', error)
			} finally {
				setLoading(false)
			}
		}

		loadReviews()
	}, [productId, currentPage, sort])

	// Рендер звездочек рейтинга
	const renderRating = (rating) => {
		return (
			<div className="flex items-center">
				{[...Array(5)].map((_, i) => (
					<Star
						key={i}
						className={`w-4 h-4 ${
							i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
						}`}
					/>
				))}
			</div>
		)
	}

	// Обработчик смены страницы
	const handlePageChange = (newPage) => {
		if (newPage >= 1 && newPage <= meta.totalPages) {
			setCurrentPage(newPage)
		}
	}

	// Обработчик смены сортировки
	const handleSortChange = (e) => {
		setSort(e.target.value)
		setCurrentPage(1) // Сбрасываем на первую страницу при изменении сортировки
	}

	return (
		<div>
			<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
				<h3 className="text-xl font-semibold">
					{meta.totalItems > 0
						? `${meta.totalItems} ${getReviewsCountText(meta.totalItems)}`
						: 'Отзывов пока нет'}
				</h3>

				<div className="mt-4 sm:mt-0 flex items-center">
					<label htmlFor="sort-select" className="text-gray-600 mr-2">
						Сортировать:
					</label>
					<select
						id="sort-select"
						value={sort}
						onChange={handleSortChange}
						className="border border-gray-300 rounded-md py-1 px-3"
					>
						<option value="newest">Сначала новые</option>
						<option value="rating_desc">По рейтингу (убывание)</option>
						<option value="rating_asc">По рейтингу (возрастание)</option>
					</select>
				</div>
			</div>

			{/* Список отзывов */}
			{loading ? (
				<div className="flex justify-center py-8">
					<div className="animate-spin rounded-full h-10 w-10 border-b-2 border-secondary-blue"></div>
				</div>
			) : reviews.length > 0 ? (
				<div className="space-y-6">
					{reviews.map((review) => (
						<div key={review.id} className="border-b border-gray-200 pb-6">
							<div className="flex items-start">
								<div className="mr-3">
									<div className="relative w-12 h-12 rounded-full overflow-hidden bg-gray-200">
										<Image
											src="/images/products/avatar-placeholder.jpg"
											alt={review.authorName}
											fill
											className="object-cover"
										/>
									</div>
								</div>

								<div className="flex-1">
									<div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-2">
										<div>
											<h4 className="font-medium">{review.authorName}</h4>
											<div className="flex items-center mt-1">
												{renderRating(review.rating)}
												<span className="ml-2 text-gray-500 text-sm">
													{review.date}
												</span>
											</div>
										</div>
									</div>

									<p className="text-gray-700 mt-2">{review.comment}</p>

									<div className="mt-3 flex space-x-4">
										<button className="flex items-center text-sm text-gray-500 hover:text-gray-700">
											<ThumbsUp className="h-4 w-4 mr-1" />
											<span>Полезно</span>
										</button>

										<button className="flex items-center text-sm text-gray-500 hover:text-gray-700">
											<Reply className="h-4 w-4 mr-1" />
											<span>Ответить</span>
										</button>
									</div>
								</div>
							</div>
						</div>
					))}
				</div>
			) : (
				<div className="bg-gray-50 p-6 rounded-lg text-center">
					<p className="text-gray-600">
						У этого товара пока нет отзывов. Будьте первым, кто оставит отзыв!
					</p>
					<button className="mt-4 bg-secondary-blue text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors">
						Написать отзыв
					</button>
				</div>
			)}

			{/* Пагинация */}
			{meta.totalPages > 1 && (
				<div className="flex justify-center mt-8">
					<nav className="flex items-center" aria-label="Пагинация отзывов">
						<button
							onClick={() => handlePageChange(currentPage - 1)}
							disabled={currentPage === 1}
							className={`px-3 py-1 rounded-l-md border ${
								currentPage === 1
									? 'bg-gray-100 text-gray-400 cursor-not-allowed'
									: 'bg-white text-gray-700 hover:bg-gray-50'
							}`}
							aria-label="Предыдущая страница"
						>
							&laquo;
						</button>

						{[...Array(meta.totalPages)].map((_, i) => (
							<button
								key={i}
								onClick={() => handlePageChange(i + 1)}
								className={`px-3 py-1 border-t border-b ${
									currentPage === i + 1
										? 'bg-secondary-blue text-white'
										: 'bg-white text-gray-700 hover:bg-gray-50'
								}`}
								aria-current={currentPage === i + 1 ? 'page' : undefined}
								aria-label={`Страница ${i + 1}`}
							>
								{i + 1}
							</button>
						))}

						<button
							onClick={() => handlePageChange(currentPage + 1)}
							disabled={currentPage === meta.totalPages}
							className={`px-3 py-1 rounded-r-md border ${
								currentPage === meta.totalPages
									? 'bg-gray-100 text-gray-400 cursor-not-allowed'
									: 'bg-white text-gray-700 hover:bg-gray-50'
							}`}
							aria-label="Следующая страница"
						>
							&raquo;
						</button>
					</nav>
				</div>
			)}

			{/* Кнопка "Написать отзыв" */}
			<div className="mt-8 flex justify-center">
				<button className="bg-dark text-white py-2 px-6 rounded-md hover:bg-hover transition-colors">
					Написать отзыв
				</button>
			</div>
		</div>
	)
}

// Вспомогательная функция для склонения слова "отзыв"
function getReviewsCountText(count) {
	const lastDigit = count % 10
	const lastTwoDigits = count % 100

	if (lastDigit === 1 && lastTwoDigits !== 11) {
		return 'отзыв'
	} else if (
		[2, 3, 4].includes(lastDigit) &&
		![12, 13, 14].includes(lastTwoDigits)
	) {
		return 'отзыва'
	} else {
		return 'отзывов'
	}
}
