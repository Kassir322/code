'use client'

import { MapPin, Edit, Trash2, Star } from 'lucide-react'
import { useState } from 'react'
import {
	useDeleteAddressMutation,
	useSetDefaultAddressMutation,
} from '@/store/services/addressApi'

export default function AddressCard({ address, onEditClick, isDefault }) {
	const [deleteAddress, { isLoading: isDeleting }] = useDeleteAddressMutation()
	const [setDefaultAddress, { isLoading: isSettingDefault }] =
		useSetDefaultAddressMutation()
	const [isConfirmingDelete, setIsConfirmingDelete] = useState(false)

	// Форматируем полный адрес для отображения
	const fullAddress = [
		address.city,
		address.street,
		`д. ${address.house}${
			address.building ? `, корп. ${address.building}` : ''
		}`,
		address.apartment ? `кв./офис ${address.apartment}` : '',
		address.postal_code,
	]
		.filter(Boolean)
		.join(', ')

	// Обработчик удаления адреса
	const handleDelete = async () => {
		if (isConfirmingDelete) {
			try {
				const response = await deleteAddress(address.id)
				if ('error' in response) {
					console.error('Ошибка при удалении:', response.error)
					return
				}
				// Если успешно удалено, скрываем подтверждение
				if (response.data?.success) {
					setIsConfirmingDelete(false)
				}
			} catch (error) {
				console.error('Ошибка при удалении адреса:', error)
			}
		} else {
			setIsConfirmingDelete(true)
		}
	}

	// Обработчик установки адреса как основного
	const handleSetDefault = async () => {
		try {
			await setDefaultAddress(address.id)
		} catch (error) {
			console.error('Ошибка при установке адреса как основного:', error)
		}
	}

	return (
		<div
			className={`bg-white rounded-lg shadow-sm p-5 border ${
				isDefault ? 'border-secondary-blue' : 'border-gray-200'
			}`}
		>
			<div className="flex items-start justify-between mb-2">
				<div className="flex items-start">
					{isDefault && (
						<div className="bg-secondary-blue text-white text-xs font-medium px-2 py-0.5 rounded mr-2">
							Основной
						</div>
					)}
					<h3 className="text-lg font-semibold">{address.title}</h3>
				</div>

				<div className="flex space-x-2">
					<button
						onClick={() => onEditClick(address)}
						className="text-gray-500 hover:text-secondary-blue cursor-pointer transition-colors"
						aria-label="Редактировать адрес"
					>
						<Edit className="h-4 w-4" />
					</button>

					<button
						onClick={handleDelete}
						disabled={isDeleting}
						className={`${
							isConfirmingDelete
								? 'text-red-500'
								: 'text-gray-500 hover:text-red-500'
						} cursor-pointer transition-colors`}
						aria-label={
							isConfirmingDelete ? 'Подтвердить удаление' : 'Удалить адрес'
						}
					>
						<Trash2 className="h-4 w-4" />
					</button>
				</div>
			</div>

			<div className="flex items-start mt-3 text-gray-700">
				<MapPin className="h-5 w-5 text-gray-400 mr-2 flex-shrink-0 mt-0.5" />
				<div>
					<p className="text-sm">{fullAddress}</p>
					{address.recipient_name && (
						<p className="text-sm mt-1">Получатель: {address.recipient_name}</p>
					)}
					{address.recipient_phone && (
						<p className="text-sm mt-1">Телефон: {address.recipient_phone}</p>
					)}
					{address.comment && (
						<p className="text-sm mt-1 text-gray-500">
							Комментарий: {address.comment}
						</p>
					)}
				</div>
			</div>

			{!isDefault && (
				<div className="mt-4 pt-3 border-t border-gray-100">
					<button
						onClick={handleSetDefault}
						disabled={isSettingDefault}
						className="flex items-center text-sm text-secondary-blue hover:text-blue-700 cursor-pointer transition-colors"
						aria-label="Сделать основным адресом"
					>
						<Star className="h-4 w-4 mr-1" />
						<span>Сделать основным</span>
					</button>
				</div>
			)}

			{isConfirmingDelete && (
				<div className="mt-4 pt-3 border-t border-gray-100 animate-fade-in">
					<div className="bg-red-50 border border-red-200 rounded-md p-3">
						<div className="flex items-start">
							<div className="flex-shrink-0">
								<svg
									className="h-5 w-5 text-red-400"
									viewBox="0 0 20 20"
									fill="currentColor"
								>
									<path
										fillRule="evenodd"
										d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
										clipRule="evenodd"
									/>
								</svg>
							</div>
							<div className="ml-3">
								<h3 className="text-sm font-medium text-red-800">
									Подтвердите удаление
								</h3>
								<p className="text-sm text-red-700 mt-1">
									Вы уверены, что хотите удалить адрес "{address.title}"? Это
									действие нельзя отменить.
								</p>
								<div className="mt-3 flex space-x-3">
									<button
										onClick={handleDelete}
										disabled={isDeleting}
										className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 cursor-pointer transition-colors"
									>
										{isDeleting ? (
											<>
												<svg
													className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
													xmlns="http://www.w3.org/2000/svg"
													fill="none"
													viewBox="0 0 24 24"
												>
													<circle
														className="opacity-25"
														cx="12"
														cy="12"
														r="10"
														stroke="currentColor"
														strokeWidth="4"
													></circle>
													<path
														className="opacity-75"
														fill="currentColor"
														d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
													></path>
												</svg>
												Удаление...
											</>
										) : (
											'Да, удалить'
										)}
									</button>
									<button
										onClick={() => setIsConfirmingDelete(false)}
										className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary-blue cursor-pointer transition-colors"
									>
										Отмена
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	)
}
