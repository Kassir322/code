'use client'

import Link from 'next/link'
import React from 'react'

export default function LinkButton({ children, href }) {
	// 	const buttonClasses = `
	// 	${baseClasses}
	// 	${variantClasses[variant]}
	// 	${sizeClasses[size]}
	// 	${stateClasses.loading}
	// 	${stateClasses.disabled}
	// 	${className}
	// `.trim()
	return (
		<Link
			href={href}
			className="bg-dark border-dark border rounded-md inline-flex items-center justify-center py-3 px-7 text-center text-base font-medium text-white hover:bg-body-color hover:border-body-color disabled:bg-gray-3 disabled:border-gray-3 disabled:text-dark-5 hover:cursor-pointer"
		>
			{children}
		</Link>
	)
}
