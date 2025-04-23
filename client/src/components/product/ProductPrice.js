'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { formatPrice } from '@/lib/utils'
import { getProductPrice } from '@/lib/next-api'

const ProductPrice = ({
	productId,
	initialPrice,
	initialOldPrice,
	className = '',
	size = 'default',
	showOldPrice = true,
	multiply = 1,
}) => {
	const [price, setPrice] = useState(initialPrice)
	const [oldPrice, setOldPrice] = useState(initialOldPrice)
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState(null)

	const fetchPrice = async () => {
		try {
			setLoading(true)
			const data = await getProductPrice(productId)

			setPrice(data.price)
			setOldPrice(data.old_price)
			setError(null)
		} catch (err) {
			console.error('Error fetching price:', err)
			setError(err.message)
		} finally {
			setLoading(false)
		}
	}

	// useEffect(() => {
	// 	const interval = setInterval(fetchPrice, 5000)
	// 	return () => clearInterval(interval)
	// }, [productId])

	useEffect(() => {
		fetchPrice()
	}, [productId])

	return (
		<div className={`flex flex-col items-center ${className}`}>
			<div key={price}>{formatPrice(price * multiply)} ₽</div>

			{
				<div className="text-sm text-gray-500 line-through">
					{formatPrice(1234 * multiply)} ₽
				</div>
			}

			{/* {loading && (
				<div className="text-sm text-gray-500 mt-1">Обновление цены...</div>
			)}

			{error && (
				<div className="text-sm text-red-500 mt-1">Ошибка обновления цены</div>
			)} */}
		</div>
	)
}

export default ProductPrice
