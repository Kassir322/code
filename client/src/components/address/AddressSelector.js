'use client'

import { useState, useEffect } from 'react'
import { useGetAddressesQuery } from '@/store/services/addressApi'
import AddressList from './AddressList'
import AddressForm from './AddressForm'
import { MapPin, Plus } from 'lucide-react'

export default function AddressSelector({
	selectedAddress,
	onSelect,
	isInCheckoutForm = false,
}) {
	const [showAddForm, setShowAddForm] = useState(false)
	const [showAllAddresses, setShowAllAddresses] = useState(false)

	// Получаем список адресов
	const { data: addresses = [], isLoading, isSuccess } = useGetAddressesQuery()

	// Находим основной адрес для предварительного выбора
	const defaultAddress = addresses.find((address) => address.isDefault)

	// Эффект для автоматического выбора основного адреса при первой загрузке
	useEffect(() => {
		if (isSuccess && defaultAddress && !selectedAddress) {
			onSelect(defaultAddress)
		}
	}, [isSuccess, defaultAddress, selectedAddress, onSelect])

	// Обработчик выбора адреса
	const handleSelectAddress = (address) => {
		onSelect(address)
		setShowAllAddresses(false)
	}

	// Обработчик успешного добавления нового адреса
	const handleAddSuccess = () => {
		setShowAddForm(false)
	}

	// Отображаем компонент выбора способа задания адреса
	if (!showAllAddresses && !showAddForm) {
		return (
			<div className="space-y-4">
				<h3 className="text-lg font-medium">Адрес доставки</h3>

				{/* Отображаем выбранный адрес */}
				{selectedAddress && (
					<div
						className="bg-white border border-gray-200 rounded-lg p-4 cursor-pointer hover:border-secondary-blue transition-colors"
						onClick={() => setShowAllAddresses(true)}
					>
						<div className="flex items-start">
							<MapPin className="h-5 w-5 text-gray-400 mr-2 flex-shrink-0 mt-0.5" />
							<div>
								<p className="font-medium">{selectedAddress.name}</p>
								<p className="text-sm text-gray-600">
									{[
										selectedAddress.city,
										selectedAddress.street,
										`д. ${selectedAddress.house}${
											selectedAddress.building
												? `, корп. ${selectedAddress.building}`
												: ''
										}`,
										selectedAddress.apartment
											? `кв./офис ${selectedAddress.apartment}`
											: '',
										selectedAddress.postalCode,
									]
										.filter(Boolean)
										.join(', ')}
								</p>
								<p className="text-sm text-gray-600 mt-1">
									Получатель: {selectedAddress.recipientName},{' '}
									{selectedAddress.phone}
								</p>
							</div>
						</div>
						<div className="mt-2 text-sm text-secondary-blue">
							Изменить адрес доставки
						</div>
					</div>
				)}

				{/* Если нет выбранного адреса, показываем кнопки выбора */}
				{!selectedAddress && !isLoading && (
					<div className="flex flex-col space-y-3">
						<button
							onClick={() => setShowAllAddresses(true)}
							className="flex items-center justify-center border border-gray-300 rounded-md p-3 hover:border-secondary-blue cursor-pointer transition-colors"
							disabled={addresses.length === 0}
						>
							<MapPin className="h-5 w-5 mr-2 text-gray-500" />
							<span>
								{addresses.length > 0
									? 'Выбрать из сохраненных адресов'
									: 'У вас нет сохраненных адресов'}
							</span>
						</button>

						<button
							onClick={() => setShowAddForm(true)}
							className="flex items-center justify-center bg-secondary-blue text-white rounded-md p-3 hover:bg-blue-700 cursor-pointer transition-colors"
						>
							<Plus className="h-5 w-5 mr-2" />
							<span>Добавить новый адрес</span>
						</button>
					</div>
				)}

				{/* Отображаем состояние загрузки */}
				{isLoading && (
					<div className="flex justify-center items-center py-4">
						<div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-secondary-blue"></div>
					</div>
				)}
			</div>
		)
	}

	// Отображаем форму добавления нового адреса
	if (showAddForm) {
		return (
			<div className="space-y-4">
				<h3 className="text-lg font-medium">Добавление нового адреса</h3>
				<AddressForm
					onSuccess={handleAddSuccess}
					onCancel={() => setShowAddForm(false)}
					parentFormHandler={isInCheckoutForm}
				/>
			</div>
		)
	}

	// Отображаем список всех адресов для выбора
	return (
		<div className="space-y-4">
			<div className="flex justify-between items-center">
				<h3 className="text-lg font-medium">Выберите адрес доставки</h3>
				<button
					onClick={() => setShowAddForm(true)}
					className="inline-flex items-center px-3 py-1.5 text-sm bg-secondary-blue text-white rounded-md hover:bg-blue-700 cursor-pointer transition-colors"
				>
					<Plus className="h-4 w-4 mr-1" />
					<span>Добавить новый</span>
				</button>
			</div>

			{addresses.length > 0 ? (
				<div className="grid grid-cols-1 gap-4">
					{addresses.map((address) => (
						<div
							key={address.id}
							className={`bg-white border rounded-lg p-4 cursor-pointer ${
								selectedAddress?.id === address.id
									? 'border-secondary-blue ring-1 ring-secondary-blue'
									: 'border-gray-200 hover:border-secondary-blue'
							} transition-colors`}
							onClick={() => handleSelectAddress(address)}
						>
							<div className="flex items-start">
								<div className="flex-shrink-0 mr-3">
									<input
										type="radio"
										checked={selectedAddress?.id === address.id}
										onChange={() => handleSelectAddress(address)}
										className="h-4 w-4 text-secondary-blue focus:ring-secondary-blue border-gray-300"
									/>
								</div>
								<div>
									<p className="font-medium">
										{address.name}
										{address.isDefault && (
											<span className="ml-2 text-xs bg-secondary-blue text-white px-2 py-0.5 rounded">
												Основной
											</span>
										)}
									</p>
									<p className="text-sm text-gray-600">
										{[
											address.city,
											address.street,
											`д. ${address.house}${
												address.building ? `, корп. ${address.building}` : ''
											}`,
											address.apartment ? `кв./офис ${address.apartment}` : '',
											address.postalCode,
										]
											.filter(Boolean)
											.join(', ')}
									</p>
									<p className="text-sm text-gray-600 mt-1">
										Получатель: {address.recipientName}, {address.phone}
									</p>
								</div>
							</div>
						</div>
					))}
				</div>
			) : (
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

			<div className="flex justify-end mt-4">
				<button
					onClick={() => setShowAllAddresses(false)}
					className="px-4 py-2 text-gray-700 hover:text-gray-900 cursor-pointer transition-colors"
				>
					Отмена
				</button>
			</div>
		</div>
	)
}
