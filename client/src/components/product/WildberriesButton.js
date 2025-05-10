import Image from 'next/image'
import Link from 'next/link'

export default function WildberriesButton({ article }) {
	return (
		<Link
			href={`https://www.wildberries.ru/catalog/${article}/detail.aspx`}
			className="block w-full max-w-2xl mx-auto my-8 bg-[#CB11AB] hover:bg-[#B10D9A] text-white rounded-xl p-4 transition-colors duration-200 cursor-pointer"
		>
			<div className="flex items-center justify-center gap-3">
				<Image
					src="/images/wb_logo.png"
					alt="Wildberries Logo"
					width={40}
					height={40}
					className="w-10 h-10 group-hover:rotate-x-25 group-hover:rotate-z-15 transform-3d transition-all duration-700"
				/>
				<span className="text-lg font-semibold">Купить на Wildberries</span>
			</div>
		</Link>
	)
}
