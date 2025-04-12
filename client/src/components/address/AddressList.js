'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import AddressCard from './AddressCard'
import AddressForm from './AddressForm'
import { useGetAddressesQuery } from '@/store/services/addressApi'

export default function AddressList({
	onSelect = null,
	showForm = true,
	canSelectAddress = false,
}) {
	const [showAddForm, setShowAddForm] = useState(false)
	const [editingAddress, setEditingAddress] = useState(null)

	// Загружаем список адресов пользователя
	const {
		data: addresses = [],
		isLoading,
		error,
		refetch,
	} = useGetAddressesQuery()

	// Обработчик клика по кнопке редактирования
	const handleEditClick = (address) => {
		setEditingAddress(address)
		setShowAddForm(true)
	}

	// Обработчик успешного сохранения адреса
	const handleFormSuccess = () => {
		setShowAddForm(false)
		setEditingAddress(null)
		refetch() // Обновляем список адресов
	}

	// Обработчик отмены формы
	const handleFormCancel = () => {
		setShowAddForm(false)
		setEditingAddress(null)
	}

	// Обработчик выбора адреса (для компонента выбора адреса при оформлении заказа)
	const handleSelect = (address) => {
		if (onSelect && canSelectAddress) {
			onSelect(address)
		}
	}

	// Находим основной адрес
	const defaultAddress = addresses.find((address) => address.isDefault)

	// Сортируем адреса так, чтобы основной был первым
	const sortedAddresses = [...addresses].sort((a, b) => {
		if (a.isDefault) return -1
		if (b.isDefault) return 1
		return 0
	})

	// Отображаем загрузку
	if (isLoading) {
		return (
			<div className="flex justify-center items-center py-8">
				<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-secondary-blue"></div>
			</div>
		)
	}

	// Отображаем ошибку
	if (error) {
		return (
			<div className="bg-red-50 p-4 rounded-md">
				<p className="text-red-700">
					Произошла ошибка при загрузке адресов. Попробуйте обновить страницу.
				</p>
			</div>
		)
	}

	return (
		<div className="space-y-6">
			{/* Если нет адресов, отображаем соответствующее сообщение */}
			{addresses.length === 0 && !showAddForm && (
				<div className="bg-gray-50 p-6 rounded-lg text-center">
					<p className="text-gray-600 mb-4">
						У вас еще нет сохраненных адресов доставки.
					</p>
					<button
						onClick={() => setShowAddForm(true)}
						className="inline-flex items-center px-4 py-2 bg-secondary-blue text-white rounded-md hover:bg-blue-700 cursor-pointer transition-colors"
					>
						<Plus className="h-4 w-4 mr-1" />
						<span>Добавить адрес</span>
					</button>
				</div>
			)}

			{/* Если есть адреса, отображаем их */}
			{addresses.length > 0 && (
				<div className="space-y-6">
					<div className="flex justify-between items-center">
						<h2 className="text-lg font-medium">Ваши адреса</h2>
						{showForm && !showAddForm && !editingAddress && (
							<button
								onClick={() => setShowAddForm(true)}
								className="inline-flex items-center px-3 py-1.5 text-sm bg-secondary-blue text-white rounded-md hover:bg-blue-700 cursor-pointer transition-colors"
							>
								<Plus className="h-4 w-4 mr-1" />
								<span>Добавить адрес</span>
							</button>
						)}
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						{sortedAddresses.map((address) => (
							<div
								key={address.id}
								className={canSelectAddress ? 'cursor-pointer' : ''}
								onClick={
									canSelectAddress ? () => handleSelect(address) : undefined
								}
							>
								<AddressCard
									address={address}
									onEditClick={handleEditClick}
									isDefault={address.isDefault}
								/>
							</div>
						))}
					</div>
				</div>
			)}

			{/* Форма добавления/редактирования адреса */}
			{showForm && showAddForm && (
				<div className="mt-6">
					<AddressForm
						address={editingAddress}
						onSuccess={handleFormSuccess}
						onCancel={handleFormCancel}
					/>
				</div>
			)}
		</div>
	)
}
