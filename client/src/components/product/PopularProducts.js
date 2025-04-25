'use client'
// src/components/product/PopularProducts.js (обновленная версия)
import ProductCard from '@/components/ProductCard'
import { useState, useEffect } from 'react'

// Функция-заглушка для получения популярных товаров
const fetchPopularProducts = async (currentProductSlug) => {
	// В реальном приложении здесь будет запрос к API
	// const response = await fetch(`/api/products/popular?exclude=${currentProductSlug}`);
	// return await response.json();
}

export default function PopularProducts({ products }) {
	if (!products?.length) return null

	return (
		<section className="my-16">
			<h2 className="text-2xl font-bold mb-8">Популярные товары</h2>
			<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
				{products.map((product) => (
					<ProductCard key={product.id} product={product} />
				))}
			</div>
		</section>
	)
}
