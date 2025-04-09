'use client'

import { ShoppingBag } from 'lucide-react'
import Link from 'next/link'
import { useSelector } from 'react-redux'
import { selectCartItemsCount } from '@/store/slices/cartSlice'
import { useState, useEffect } from 'react'

export default function CartIcon() {
	const itemsCount = useSelector(selectCartItemsCount)
	const [prevCount, setPrevCount] = useState(0)
	const [animate, setAnimate] = useState(false)

	// Анимация при изменении количества товаров
	useEffect(() => {
		if (prevCount !== 0 && prevCount !== itemsCount) {
			setAnimate(true)

			const timer = setTimeout(() => {
				setAnimate(false)
			}, 200)

			return () => clearTimeout(timer)
		}

		setPrevCount(itemsCount)
	}, [itemsCount, prevCount])

	return (
		<div className="relative inline-flex items-center">
			<ShoppingBag
				className={`h-6 w-6 text-gray-800 hover:text-secondary-blue transition-colors `}
				// ${
				// 	animate ? 'scale-125 text-secondary-blue' : ''
				// }
			/>
			{itemsCount > 0 && (
				<span
					className={`absolute -top-2 -right-2 bg-secondary-blue text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center transition-transform ${
						animate ? 'scale-125' : ''
					}`}
				>
					{itemsCount}
				</span>
			)}
		</div>
	)
}
