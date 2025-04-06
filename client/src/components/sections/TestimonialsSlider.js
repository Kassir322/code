'use client'

import React, { useState, useRef, useEffect } from 'react'
import { ChevronLeft, ChevronRight, Star } from 'lucide-react'

export default function TestimonialsSlider({ testimonials }) {
	const [activeIndex, setActiveIndex] = useState(0)
	const [startX, setStartX] = useState(0)
	const [isDragging, setIsDragging] = useState(false)
	const sliderRef = useRef(null)

	// Функция для перехода к предыдущему слайду
	const prevSlide = () => {
		setActiveIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1))
	}

	// Функция для перехода к следующему слайду
	const nextSlide = () => {
		setActiveIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1))
	}

	// Функция для перехода к определенному слайду
	const goToSlide = (index) => {
		setActiveIndex(index)
	}

	// Обработчики событий для перетаскивания
	const handleMouseDown = (e) => {
		setStartX(e.pageX)
		setIsDragging(true)
	}

	const handleTouchStart = (e) => {
		setStartX(e.touches[0].pageX)
		setIsDragging(true)
	}

	const handleMouseMove = (e) => {
		if (!isDragging) return
		e.preventDefault()

		const currentX = e.pageX
		const diff = startX - currentX

		if (diff > 50) {
			nextSlide()
			setIsDragging(false)
		} else if (diff < -50) {
			prevSlide()
			setIsDragging(false)
		}
	}

	const handleTouchMove = (e) => {
		if (!isDragging) return

		const currentX = e.touches[0].pageX
		const diff = startX - currentX

		if (diff > 50) {
			nextSlide()
			setIsDragging(false)
		} else if (diff < -50) {
			prevSlide()
			setIsDragging(false)
		}
	}

	const handleMouseUp = () => {
		setIsDragging(false)
	}

	const handleTouchEnd = () => {
		setIsDragging(false)
	}

	// Добавляем обработчики событий
	useEffect(() => {
		const slider = sliderRef.current
		if (!slider) return

		slider.addEventListener('mouseup', handleMouseUp)
		slider.addEventListener('touchend', handleTouchEnd)
		document.addEventListener('mouseup', handleMouseUp)

		return () => {
			slider.removeEventListener('mouseup', handleMouseUp)
			slider.removeEventListener('touchend', handleTouchEnd)
			document.removeEventListener('mouseup', handleMouseUp)
		}
	}, [])

	// Рендер рейтинга в виде звездочек
	const renderRating = (rating) => {
		return (
			<div className="flex items-center mb-2">
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

	return (
		<div className="relative max-w-4xl mx-auto">
			{/* Слайдер */}
			<div
				ref={sliderRef}
				className="overflow-hidden relative"
				onMouseDown={handleMouseDown}
				onMouseMove={handleMouseMove}
				onTouchStart={handleTouchStart}
				onTouchMove={handleTouchMove}
				style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
			>
				<div
					className="flex transition-transform duration-300 ease-in-out"
					style={{ transform: `translateX(-${activeIndex * 100}%)` }}
				>
					{testimonials.map((testimonial, index) => (
						<div key={testimonial.id} className="min-w-full px-4">
							<div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
								{renderRating(testimonial.rating)}
								<p className="text-gray-600 italic mb-4">
									"{testimonial.text}"
								</p>
								<div className="flex justify-between items-center">
									<span className="font-medium">{testimonial.name}</span>
									<span className="text-sm text-gray-500">
										{testimonial.date}
									</span>
								</div>
							</div>
						</div>
					))}
				</div>
			</div>

			{/* Навигационные кнопки */}
			<button
				className="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-6 bg-white rounded-full p-2 shadow-md z-10 hover:bg-gray-100 transition-colors"
				onClick={prevSlide}
				aria-label="Предыдущий отзыв"
			>
				<ChevronLeft className="w-5 h-5" />
			</button>

			<button
				className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-6 bg-white rounded-full p-2 shadow-md z-10 hover:bg-gray-100 transition-colors"
				onClick={nextSlide}
				aria-label="Следующий отзыв"
			>
				<ChevronRight className="w-5 h-5" />
			</button>

			{/* Точки для навигации */}
			<div className="flex justify-center mt-6 space-x-2">
				{testimonials.map((_, index) => (
					<button
						key={index}
						className={`w-3 h-3 rounded-full transition-colors ${
							index === activeIndex
								? 'bg-primary'
								: 'bg-gray-300 hover:bg-gray-400'
						}`}
						onClick={() => goToSlide(index)}
						aria-label={`Перейти к отзыву ${index + 1}`}
					/>
				))}
			</div>
		</div>
	)
}
