// src/components/product/SimilarProducts.js
'use client'

import { useState, useEffect } from 'react'
import ProductCard from '@/components/ProductCard'

// Функция для получения похожих товаров (из той же категории)
const fetchSimilarProducts = async (currentProductSlug, category) => {
	// В реальном приложении здесь будет запрос к API
	// const response = await fetch(`/api/products/similar?category=${category}&exclude=${currentProductSlug}`);
	// return await response.json();

	// Импортируем моковые данные
	const productMockData = (await import('@/lib/mock-data')).default

	// Фильтруем товары, которые:
	// 1. Относятся к той же категории (предмету)
	// 2. Имеют другой slug (не текущий товар)
	const filteredProducts = productMockData.filter(
		(product) =>
			product.subject?.toLowerCase() === category?.toLowerCase() &&
			product.slug !== currentProductSlug
	)

	// Возвращаем максимум 4 товара
	return filteredProducts.slice(0, 4)
}

export default function SimilarProducts({ products }) {
	if (!products?.length) return null

	return (
		<section className="my-16">
			<h2 className="text-2xl font-bold mb-8">Похожие товары</h2>
			<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
				{products.map((product) => (
					<ProductCard key={product.id} product={product} />
				))}
			</div>
		</section>
	)
}
