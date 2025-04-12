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
	name: z
		.string()
		.min(2, 'Минимум 2 символа')
		.max(100, 'Максимум 100 символов'),
	recipientName: z
		.string()
		.min(2, 'Укажите ФИО получателя')
		.max(150, 'Слишком длинное ФИО'),
	phone: z.string().min(10, 'Введите корректный номер телефона'),
	city: z.string().min(2, 'Укажите город'),
	street: z.string().min(2, 'Укажите улицу'),
	house: z.string().min(1, 'Укажите номер дома'),
	building: z.string().optional(),
	apartment: z.string().optional(),
	postalCode: z.string().min(6, 'Введите корректный почтовый индекс'),
	comment: z.string().optional(),
	isDefault: z.boolean().default(false),
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
					name: address.name || '',
					recipientName: address.recipientName || '',
					phone: address.phone || '',
					city: address.city || '',
					street: address.street || '',
					house: address.house || '',
					building: address.building || '',
					apartment: address.apartment || '',
					postalCode: address.postalCode || '',
					comment: address.comment || '',
					isDefault: address.isDefault || false,
			  }
			: {
					name: '',
					recipientName: '',
					phone: '',
					city: '',
					street: '',
					house: '',
					building: '',
					apartment: '',
					postalCode: '',
					comment: '',
					isDefault: false,
			  },
	})

	// Обработчик отправки формы
	const onSubmit = async (data) => {
		setIsSubmitting(true)
		try {
			// Если редактируем существующий адрес
			if (address) {
				await updateAddress({ id: address.id, data })

				// Если необходимо установить адрес как основной
				if (data.isDefault && !address.isDefault) {
					await setDefaultAddress(address.id)
				}
			} else {
				// Создаем новый адрес
				const result = await createAddress(data)

				// Если необходимо установить адрес как основной
				if (data.isDefault && result.data?.id) {
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
							htmlFor="name"
							className="block text-sm font-medium text-gray-700 mb-1"
						>
							Название адреса <span className="text-red-500">*</span>
						</label>
						<input
							type="text"
							id="name"
							{...register('name')}
							className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-secondary-blue ${
								errors.name ? 'border-red-500' : 'border-gray-300'
							}`}
							placeholder="Например: Дом, Работа"
						/>
						{errors.name && (
							<p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
						)}
					</div>

					{/* ФИО получателя */}
					<div>
						<label
							htmlFor="recipientName"
							className="block text-sm font-medium text-gray-700 mb-1"
						>
							ФИО получателя <span className="text-red-500">*</span>
						</label>
						<input
							type="text"
							id="recipientName"
							{...register('recipientName')}
							className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-secondary-blue ${
								errors.recipientName ? 'border-red-500' : 'border-gray-300'
							}`}
							placeholder="Иванов Иван Иванович"
						/>
						{errors.recipientName && (
							<p className="mt-1 text-sm text-red-500">
								{errors.recipientName.message}
							</p>
						)}
					</div>

					{/* Телефон */}
					<div>
						<label
							htmlFor="phone"
							className="block text-sm font-medium text-gray-700 mb-1"
						>
							Телефон <span className="text-red-500">*</span>
						</label>
						<input
							type="tel"
							id="phone"
							{...register('phone')}
							className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-secondary-blue ${
								errors.phone ? 'border-red-500' : 'border-gray-300'
							}`}
							placeholder="+7 (999) 123-45-67"
						/>
						{errors.phone && (
							<p className="mt-1 text-sm text-red-500">
								{errors.phone.message}
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
								htmlFor="postalCode"
								className="block text-sm font-medium text-gray-700 mb-1"
							>
								Почтовый индекс <span className="text-red-500">*</span>
							</label>
							<input
								type="text"
								id="postalCode"
								{...register('postalCode')}
								className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-secondary-blue ${
									errors.postalCode ? 'border-red-500' : 'border-gray-300'
								}`}
								placeholder="123456"
							/>
							{errors.postalCode && (
								<p className="mt-1 text-sm text-red-500">
									{errors.postalCode.message}
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
							id="isDefault"
							{...register('isDefault')}
							className="h-4 w-4 text-secondary-blue focus:ring-secondary-blue border-gray-300 rounded"
						/>
						<label
							htmlFor="isDefault"
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
