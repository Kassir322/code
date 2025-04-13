'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useState } from 'react'
import {
	useCreateAddressMutation,
	useUpdateAddressMutation,
	useSetDefaultAddressMutation,
} from '@/store/services/addressApi'

// Схема валидации адреса с использованием Zod
const addressSchema = z.object({
	title: z
		.string()
		.min(2, 'Минимум 2 символа')
		.max(255, 'Максимум 255 символов')
		.regex(
			/^[а-яА-ЯёЁ0-9\s-]+$/,
			'Допустимы только буквы, цифры, пробелы и дефисы'
		),
	recipient_name: z
		.string()
		.min(5, 'Минимум 5 символов')
		.max(150, 'Максимум 150 символов')
		.regex(/^[а-яА-ЯёЁ\s-]+$/, 'Допустимы только буквы, пробелы и дефисы'),
	recipient_phone: z
		.string()
		.regex(/^\+7[0-9]{10}$/, 'Телефон должен быть в формате +79991234567'),
	city: z
		.string()
		.min(2, 'Минимум 2 символа')
		.regex(/^[а-яА-ЯёЁ\s-]+$/, 'Допустимы только буквы, пробелы и дефисы'),
	street: z
		.string()
		.min(2, 'Минимум 2 символа')
		.regex(
			/^[а-яА-ЯёЁ0-9\s-\.]+$/,
			'Допустимы буквы, цифры, пробелы, точки и дефисы'
		),
	house: z
		.string()
		.regex(
			/^[0-9]+(?:\/[0-9]+)?[а-яА-Я]?$/,
			'Номер дома должен быть числом с опциональной дробью и буквой (например: 12, 12а или 417/3)'
		),
	building: z
		.string()
		.regex(
			/^[0-9]+(?:\/[0-9]+)?[а-яА-Я]?$/,
			'Корпус должен быть числом с опциональной дробью и буквой (например: 1, 1а или 1/2)'
		)
		.optional()
		.or(z.literal('')),
	apartment: z
		.string()
		.regex(
			/^[0-9]+(?:\/[0-9]+)?[а-яА-Я]?$/,
			'Номер квартиры должен быть числом с опциональной дробью и буквой (например: 42, 42б или 42/1)'
		)
		.optional()
		.or(z.literal('')),
	postal_code: z
		.string()
		.regex(/^[0-9]{6}$/, 'Почтовый индекс должен состоять из 6 цифр'),
	comment: z
		.string()
		.max(500, 'Максимум 500 символов')
		.optional()
		.or(z.literal('')),
	is_default: z.boolean().default(false),
})

export default function AddressForm({
	address = null,
	onSuccess,
	onCancel,
	parentFormHandler = false,
}) {
	const [isSubmitting, setIsSubmitting] = useState(false)
	const [createAddress] = useCreateAddressMutation()
	const [updateAddress] = useUpdateAddressMutation()
	const [setDefaultAddress] = useSetDefaultAddressMutation()

	// Инициализация формы с значениями редактируемого адреса или с пустыми значениями
	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
	} = useForm({
		resolver: zodResolver(addressSchema),
		defaultValues: address
			? {
					title: address.title || '',
					recipient_name: address.recipient_name || '',
					recipient_phone: address.recipient_phone || '',
					city: address.city || '',
					street: address.street || '',
					house: address.house || '',
					building: address.building || '',
					apartment: address.apartment || '',
					postal_code: address.postal_code || '',
					comment: address.comment || '',
					is_default: address.is_default || false,
			  }
			: {
					title: '',
					recipient_name: '',
					recipient_phone: '',
					city: '',
					street: '',
					house: '',
					building: '',
					apartment: '',
					postal_code: '',
					comment: '',
					is_default: false,
			  },
	})

	// Обработчик отправки формы
	const onSubmit = async (data) => {
		setIsSubmitting(true)
		try {
			console.log('Отправляемые данные:', data)
			// Если редактируем существующий адрес
			if (address) {
				await updateAddress({ id: address.id, data: { data } })

				// Если необходимо установить адрес как основной
				if (data.is_default && !address.is_default) {
					await setDefaultAddress(address.id)
				}
			} else {
				// Создаем новый адрес
				const result = await createAddress({ data })

				// Если необходимо установить адрес как основной
				if (data.is_default && result.data?.id) {
					await setDefaultAddress(result.data.id)
				}
			}

			// Очищаем форму и вызываем коллбэк успешного завершения
			reset()
			onSuccess()
		} catch (error) {
			console.error('Ошибка при сохранении адреса:', error)
		} finally {
			setIsSubmitting(false)
		}
	}

	// Создаем обработчик для формы
	const formHandler = handleSubmit(onSubmit)

	// Если компонент внутри родительской формы, используем div вместо form
	const ContentWrapper = parentFormHandler ? 'div' : 'form'
	const wrapperProps = parentFormHandler ? {} : { onSubmit: formHandler }

	return (
		<ContentWrapper {...wrapperProps} className="space-y-4">
			<div className="bg-white rounded-lg shadow-sm p-6">
				<h3 className="text-lg font-semibold mb-4">
					{address ? 'Редактирование адреса' : 'Новый адрес'}
				</h3>

				<div className="space-y-4">
					{/* Название адреса */}
					<div>
						<label
							htmlFor="title"
							className="block text-sm font-medium text-gray-700 mb-1"
						>
							Название адреса <span className="text-red-500">*</span>
						</label>
						<input
							type="text"
							id="title"
							{...register('title')}
							className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-secondary-blue ${
								errors.title ? 'border-red-500' : 'border-gray-300'
							}`}
							placeholder="Например: Дом, Работа"
						/>
						{errors.title && (
							<p className="mt-1 text-sm text-red-500">
								{errors.title.message}
							</p>
						)}
					</div>

					{/* ФИО получателя */}
					<div>
						<label
							htmlFor="recipient_name"
							className="block text-sm font-medium text-gray-700 mb-1"
						>
							ФИО получателя <span className="text-red-500">*</span>
						</label>
						<input
							type="text"
							id="recipient_name"
							{...register('recipient_name')}
							className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-secondary-blue ${
								errors.recipient_name ? 'border-red-500' : 'border-gray-300'
							}`}
							placeholder="Иванов Иван Иванович"
						/>
						{errors.recipient_name && (
							<p className="mt-1 text-sm text-red-500">
								{errors.recipient_name.message}
							</p>
						)}
					</div>

					{/* Телефон */}
					<div>
						<label
							htmlFor="recipient_phone"
							className="block text-sm font-medium text-gray-700 mb-1"
						>
							Телефон <span className="text-red-500">*</span>
						</label>
						<input
							type="tel"
							id="recipient_phone"
							{...register('recipient_phone')}
							className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-secondary-blue ${
								errors.recipient_phone ? 'border-red-500' : 'border-gray-300'
							}`}
							placeholder="+7 (999) 123-45-67"
						/>
						{errors.recipient_phone && (
							<p className="mt-1 text-sm text-red-500">
								{errors.recipient_phone.message}
							</p>
						)}
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						{/* Город */}
						<div>
							<label
								htmlFor="city"
								className="block text-sm font-medium text-gray-700 mb-1"
							>
								Город <span className="text-red-500">*</span>
							</label>
							<input
								type="text"
								id="city"
								{...register('city')}
								className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-secondary-blue ${
									errors.city ? 'border-red-500' : 'border-gray-300'
								}`}
								placeholder="Москва"
							/>
							{errors.city && (
								<p className="mt-1 text-sm text-red-500">
									{errors.city.message}
								</p>
							)}
						</div>

						{/* Почтовый индекс */}
						<div>
							<label
								htmlFor="postal_code"
								className="block text-sm font-medium text-gray-700 mb-1"
							>
								Почтовый индекс <span className="text-red-500">*</span>
							</label>
							<input
								type="text"
								id="postal_code"
								{...register('postal_code')}
								className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-secondary-blue ${
									errors.postal_code ? 'border-red-500' : 'border-gray-300'
								}`}
								placeholder="123456"
							/>
							{errors.postal_code && (
								<p className="mt-1 text-sm text-red-500">
									{errors.postal_code.message}
								</p>
							)}
						</div>
					</div>

					{/* Улица */}
					<div>
						<label
							htmlFor="street"
							className="block text-sm font-medium text-gray-700 mb-1"
						>
							Улица <span className="text-red-500">*</span>
						</label>
						<input
							type="text"
							id="street"
							{...register('street')}
							className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-secondary-blue ${
								errors.street ? 'border-red-500' : 'border-gray-300'
							}`}
							placeholder="Ленина"
						/>
						{errors.street && (
							<p className="mt-1 text-sm text-red-500">
								{errors.street.message}
							</p>
						)}
					</div>

					<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
						{/* Дом */}
						<div>
							<label
								htmlFor="house"
								className="block text-sm font-medium text-gray-700 mb-1"
							>
								Дом <span className="text-red-500">*</span>
							</label>
							<input
								type="text"
								id="house"
								{...register('house')}
								className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-secondary-blue ${
									errors.house ? 'border-red-500' : 'border-gray-300'
								}`}
								placeholder="10"
							/>
							{errors.house && (
								<p className="mt-1 text-sm text-red-500">
									{errors.house.message}
								</p>
							)}
						</div>

						{/* Корпус */}
						<div>
							<label
								htmlFor="building"
								className="block text-sm font-medium text-gray-700 mb-1"
							>
								Корпус
							</label>
							<input
								type="text"
								id="building"
								{...register('building')}
								className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary-blue"
								placeholder="1"
							/>
						</div>

						{/* Квартира/офис */}
						<div>
							<label
								htmlFor="apartment"
								className="block text-sm font-medium text-gray-700 mb-1"
							>
								Квартира/офис
							</label>
							<input
								type="text"
								id="apartment"
								{...register('apartment')}
								className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary-blue"
								placeholder="42"
							/>
						</div>
					</div>

					{/* Комментарий */}
					<div>
						<label
							htmlFor="comment"
							className="block text-sm font-medium text-gray-700 mb-1"
						>
							Комментарий для курьера
						</label>
						<textarea
							id="comment"
							{...register('comment')}
							rows="3"
							className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary-blue"
							placeholder="Например: код домофона, особенности подъезда и т.д."
						></textarea>
					</div>

					{/* Чекбокс "Использовать как адрес по умолчанию" */}
					<div className="flex items-center">
						<input
							type="checkbox"
							id="is_default"
							{...register('is_default')}
							className="h-4 w-4 text-secondary-blue focus:ring-secondary-blue border-gray-300 rounded"
						/>
						<label
							htmlFor="is_default"
							className="ml-2 block text-sm text-gray-700"
						>
							Использовать как адрес по умолчанию
						</label>
					</div>
				</div>

				{/* Кнопки действий */}
				<div className="flex justify-end space-x-3 mt-6">
					<button
						type="button"
						onClick={onCancel}
						className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 cursor-pointer transition-colors"
					>
						Отмена
					</button>
					<button
						type={parentFormHandler ? 'button' : 'submit'}
						onClick={parentFormHandler ? formHandler : undefined}
						disabled={isSubmitting}
						className="px-4 py-2 bg-secondary-blue text-white rounded-md hover:bg-blue-700 cursor-pointer transition-colors disabled:bg-gray-400"
					>
						{isSubmitting
							? 'Сохранение...'
							: address
							? 'Сохранить изменения'
							: 'Добавить адрес'}
					</button>
				</div>
			</div>
		</ContentWrapper>
	)
}
