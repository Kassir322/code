'use client'
// src/components/product/ProductReviews.js
import { useState, useEffect } from 'react'
import { Star, ThumbsUp, Reply } from 'lucide-react'
import Image from 'next/image'
import { addProductReview } from '@/lib/api'
import { useAuth } from '@/hooks/useAuth'
import { toast } from 'react-hot-toast'

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

export default function ProductReviews({ product, reviews, onReviewAdded }) {
	const { user } = useAuth()
	const [rating, setRating] = useState(0)
	const [comment, setComment] = useState('')
	const [isSubmitting, setIsSubmitting] = useState(false)

	const handleSubmit = async (e) => {
		e.preventDefault()
		if (!user) {
			console.log(`!user`)
			toast.error('Для добавления отзыва необходимо авторизоваться')
			return
		}
		console.log(`user: ${JSON.stringify(user)}`)

		if (rating === 0) {
			console.log(`rating === 0`)
			toast.error('Пожалуйста, выберите оценку')
			return
		}

		setIsSubmitting(true)
		try {
			console.log(`addProductReview`)
			await addProductReview({
				rating,
				comment,
				productId: product.id,
			})
			console.log(`toast.success('Отзыв успешно добавлен')`)
			toast.success('Отзыв успешно добавлен')
			setRating(0)
			setComment('')
			onReviewAdded?.()
		} catch (error) {
			console.log(`error: ${error}`)
			toast.error('Ошибка при добавлении отзыва')
		} finally {
			setIsSubmitting(false)
		}
	}

	const averageRating =
		reviews?.reduce((acc, review) => acc + review.rating, 0) /
			reviews?.length || 0

	return (
		<div className="mt-8">
			<h2 className="text-2xl font-semibold mb-4">Отзывы</h2>
			<div className="flex items-center mb-6">
				<div className="flex items-center">
					{[1, 2, 3, 4, 5].map((star) => (
						<Star
							key={star}
							className={`h-5 w-5 ${
								star <= averageRating
									? 'text-yellow-400 fill-yellow-400'
									: 'text-gray-300'
							}`}
						/>
					))}
				</div>
				<span className="ml-2 text-gray-600">
					{reviews?.length} {reviews?.length === 1 ? 'отзыв' : 'отзывов'}
				</span>
			</div>

			{user && (
				<form onSubmit={handleSubmit} className="mb-8">
					<div className="mb-4">
						<label className="block text-sm font-medium text-gray-700 mb-2">
							Ваша оценка
						</label>
						<div className="flex">
							{[1, 2, 3, 4, 5].map((star) => (
								<button
									key={star}
									type="button"
									onClick={() => setRating(star)}
									className="focus:outline-none"
								>
									<Star
										className={`h-6 w-6 ${
											star <= rating
												? 'text-yellow-400 fill-yellow-400'
												: 'text-gray-300'
										} hover:text-yellow-400 hover:fill-yellow-400 transition-colors`}
									/>
								</button>
							))}
						</div>
					</div>
					<div className="mb-4">
						<label
							htmlFor="comment"
							className="block text-sm font-medium text-gray-700 mb-2"
						>
							Ваш отзыв
						</label>
						<textarea
							id="comment"
							rows={4}
							value={comment}
							onChange={(e) => setComment(e.target.value)}
							className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary-blue focus:border-transparent"
							placeholder="Поделитесь своим мнением о товаре..."
						/>
					</div>
					<button
						type="submit"
						disabled={isSubmitting}
						className="bg-secondary-blue text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
					>
						{isSubmitting ? 'Отправка...' : 'Отправить отзыв'}
					</button>
				</form>
			)}

			<div className="space-y-6">
				{reviews?.map((review) => (
					<div key={review.id} className="border-b border-gray-200 pb-6">
						<div className="flex items-center mb-2">
							<div className="flex">
								{[1, 2, 3, 4, 5].map((star) => (
									<Star
										key={star}
										className={`h-4 w-4 ${
											star <= review.rating
												? 'text-yellow-400 fill-yellow-400'
												: 'text-gray-300'
										}`}
									/>
								))}
							</div>
							<span className="ml-2 text-sm text-gray-600">
								{review.user?.username || 'Анонимный пользователь'}
							</span>
							<span className="ml-2 text-sm text-gray-500">
								{new Date(review.createdAt).toLocaleDateString('ru-RU')}
							</span>
						</div>
						<p className="text-gray-700">{review.comment}</p>
					</div>
				))}
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
