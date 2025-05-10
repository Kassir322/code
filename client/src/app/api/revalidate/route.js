import { revalidateTag } from 'next/cache'
import { NextResponse } from 'next/server'

export async function POST(request) {
	try {
		const { tag, secret } = await request.json()

		// Проверяем секретный ключ
		if (secret !== process.env.REVALIDATE_SECRET) {
			return NextResponse.json(
				{ message: 'Неверный секретный ключ' },
				{ status: 401 }
			)
		}

		// Ревалидируем кэш по тегу
		revalidateTag(tag)

		return NextResponse.json({ revalidated: true, now: Date.now() })
	} catch (err) {
		return NextResponse.json(
			{ message: 'Ошибка при ревалидации' },
			{ status: 500 }
		)
	}
}
