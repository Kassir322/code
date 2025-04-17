'use client'
// src/components/product/ProductGallery.js
import { useState } from 'react'
import Image from 'next/image'

export default function ProductGallery({ oldPrice, images, title }) {
	const [selectedImage, setSelectedImage] = useState(0)

	// В реальном приложении изображения будут загружаться из API
	// Здесь мы создаем заглушку для демонстрации
	const productImages = [
		{ src: '/images/products/card_example2.png', alt: title },
		{
			src: '/images/products/card_example2.png',
			alt: `${title} (вид сбоку)`,
		},
		{
			src: '/images/products/card_example2.png',
			alt: `${title} (в использовании)`,
		},
	]

	return (
		<div className="flex flex-col">
			{/* Основное изображение */}
			<div className="relative bg-neutral-03 rounded-lg overflow-hidden mb-4 aspect-[993/1347] max-h-[570px]">
				{/* Лейбл скидки, если есть */}
				{oldPrice && (
					<div className="absolute top-4 left-4 z-10 bg-red-500 text-white px-3 py-1 text-sm font-semibold rounded-md">
						{Math.round((1 - price / oldPrice) * 100)}% скидка
					</div>
				)}

				<Image
					src={
						images?.data?.[0]?.attributes?.url ||
						productImages[selectedImage].src
					}
					alt={productImages[selectedImage].alt}
					fill
					className="object-contain p-4"
					sizes="(max-width: 768px) 100vw, 50vw"
					priority // Приоритетная загрузка для LCP
				/>
			</div>

			{/* Миниатюры изображений */}
			<div className="flex space-x-2 mt-2">
				{productImages.map((image, index) => (
					<button
						key={index}
						onClick={() => setSelectedImage(index)}
						className={`relative w-20 h-24 bg-neutral-03 rounded-md overflow-hidden cursor-pointer transition-all ${
							selectedImage === index
								? 'ring-2 ring-secondary-blue'
								: 'hover:ring-1 hover:ring-gray-300'
						}`}
						aria-label={`Выбрать изображение ${index + 1}`}
					>
						<Image
							src={image.src}
							alt={image.alt}
							fill
							className="object-contain p-1"
							sizes="80px"
						/>
					</button>
				))}
			</div>
		</div>
	)
}
