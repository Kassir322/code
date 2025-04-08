import React from 'react'
import Link from 'next/link'
import LinkButton from '@/components/ui/LinkButton'

export default function HeroSection() {
	return (
		<section className="bg-neutral-01">
			<div className="container mx-auto px-4 max-w-5xl">
				<div className="text-center">
					<h1 className=" text-4xl md:text-5xl font-bold text-gray-900 mb-4">
						Mat-Focus - эффективные учебные материалы для учеников
					</h1>
					<p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
						Наши учебные карточки помогают структурировать знания и делают
						процесс обучения более эффективным. Идеальное решение для подготовки
						к экзаменам и освоения новых предметов.
					</p>

					<LinkButton className="text-lg" href="/catalog">
						Перейти в каталог
					</LinkButton>
				</div>
			</div>
		</section>
	)
}
