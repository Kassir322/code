'use client'

import { Heart } from 'lucide-react'
import { useSelector } from 'react-redux'
import { selectWishlistItemsCount } from '@/store/slices/wishlistSlice'
import { useState, useEffect } from 'react'

export default function WishlistIcon() {
	const itemsCount = useSelector(selectWishlistItemsCount)
	const [prevCount, setPrevCount] = useState(0)
	const [animate, setAnimate] = useState(false)

	// Анимация при изменении количества товаров
	useEffect(() => {
		if (prevCount !== itemsCount) {
			setAnimate(true)

			const timer = setTimeout(() => {
				setAnimate(false)
			}, 300)

			return () => clearTimeout(timer)
		}

		setPrevCount(itemsCount)
	}, [itemsCount, prevCount])

	return (
		<div className="relative inline-flex items-center">
			<Heart
				className={`h-6 w-6 text-gray-800 hover:text-red-500 transition-colors ${
					animate ? 'scale-125 text-red-500' : ''
				}`}
			/>
			{itemsCount > 0 && (
				<span
					className={`absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center transition-transform ${
						animate ? 'scale-125' : ''
					}`}
				>
					{itemsCount}
				</span>
			)}
		</div>
	)
}
