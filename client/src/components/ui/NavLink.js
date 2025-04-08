'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'

export default function NavLink({ children, href }) {
	const pathname = usePathname()
	// console.log(pathname.split('/')[1])
	// console.log(href.split('/')[1])

	return (
		<Link
			href={href}
			className={`sm:font-medium sm:text-xl hover:text-hover transition-colors ${
				pathname.split('/')[1] == href.split('/')[1] && 'text-secondary-blue'
			}`}
		>
			{children}
		</Link>
	)
}
