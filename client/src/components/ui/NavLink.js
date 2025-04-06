'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'

export default function NavLink({ children, href }) {
	const pathname = usePathname()

	return (
		<Link
			href={href}
			className={`sm:font-medium sm:text-xl hover:text-primary transition-colors ${
				pathname == href && 'text-secondary-blue'
			}`}
		>
			{children}
		</Link>
	)
}
