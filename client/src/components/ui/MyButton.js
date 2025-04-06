'use client'

import React from 'react'

export default function MyButton({
	children,
	variant = 'primary',
	size = 'md',
	isLoading = false,
	className = '',
	disabled,
	type = 'button',
	...props
}) {
	// Базовые классы
	const baseClasses =
		'font-medium rounded-md transition-colors focus:outline-none'

	// Классы для разных вариантов
	const variantClasses = {
		primary: 'bg-primary text-white hover:bg-secondary-blue',
		secondary: 'bg-secondary text-white hover:bg-secondary-dark',
		outline: 'border border-primary text-primary hover:bg-primary-light',
		ghost: 'text-primary hover:bg-primary-light',
		link: 'text-primary hover:underline',
	}

	// Классы для разных размеров
	const sizeClasses = {
		sm: 'text-sm px-3 py-1',
		md: 'font-medium px-8 py-4',
		lg: 'text-lg px-5 py-3',
	}

	// Классы для состояния загрузки и отключения
	const stateClasses = {
		loading: isLoading ? 'opacity-70 cursor-wait' : '',
		disabled: disabled ? 'opacity-60 cursor-not-allowed' : '',
	}

	// Собираем все классы вместе
	const buttonClasses = `
    ${baseClasses}
    ${variantClasses[variant]}
    ${sizeClasses[size]}
    ${stateClasses.loading}
    ${stateClasses.disabled}
    ${className}
  `.trim()

	return (
		<button
			type={type}
			disabled={disabled || isLoading}
			className={buttonClasses}
			{...props}
		>
			{isLoading ? (
				<div className="flex items-center justify-center">
					{/* Здесь можно добавить спиннер */}
					<span className="mr-2">Загрузка...</span>
				</div>
			) : (
				children
			)}
		</button>
	)
}
