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
		address.postalCode,
	]
		.filter(Boolean)
		.join(', ')

	// Обработчик удаления адреса
	const handleDelete = async () => {
		if (isConfirmingDelete) {
			try {
				await deleteAddress(address.id)
				setIsConfirmingDelete(false)
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
					<h3 className="text-lg font-semibold">{address.name}</h3>
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
					{address.recipientName && (
						<p className="text-sm mt-1">Получатель: {address.recipientName}</p>
					)}
					{address.phone && (
						<p className="text-sm mt-1">Телефон: {address.phone}</p>
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
				<div className="mt-4 pt-3 border-t border-gray-100">
					<p className="text-sm text-red-500 mb-2">
						Вы уверены, что хотите удалить этот адрес?
					</p>
					<div className="flex space-x-2">
						<button
							onClick={handleDelete}
							disabled={isDeleting}
							className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600 cursor-pointer transition-colors"
						>
							{isDeleting ? 'Удаление...' : 'Да, удалить'}
						</button>
						<button
							onClick={() => setIsConfirmingDelete(false)}
							className="px-3 py-1 bg-gray-200 text-gray-700 text-sm rounded hover:bg-gray-300 cursor-pointer transition-colors"
						>
							Отмена
						</button>
					</div>
				</div>
			)}
		</div>
	)
}
