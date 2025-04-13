'use strict'

/**
 * address controller
 */

const { createCoreController } = require('@strapi/strapi').factories

module.exports = createCoreController('api::address.address', ({ strapi }) => ({
	// Кастомный метод create
	async create(ctx) {
		console.log('=== CREATE ADDRESS ===')
		console.log('Request body:', ctx.request.body)
		console.log('User ID:', ctx.state.user?.id)

		const userId = ctx.state.user.id
		const { data } = ctx.request.body

		try {
			// Если адрес устанавливается как основной, сбрасываем флаг у других адресов
			if (data.is_default) {
				console.log('Setting as default address, resetting other defaults...')
				await strapi.entityService
					.findMany('api::address.address', {
						filters: { user: userId, is_default: true },
					})
					.then(async (addresses) => {
						for (const address of addresses) {
							await strapi.entityService.update(
								'api::address.address',
								address.id,
								{
									data: { is_default: false },
								}
							)
						}
					})
			}

			// Создаем новый адрес
			console.log('Creating new address with data:', data)
			const address = await strapi.entityService.create(
				'api::address.address',
				{
					data: {
						...data,
						user: {
							connect: [userId],
						},
					},
					populate: {
						user: {
							fields: ['id', 'username', 'email'],
						},
					},
				}
			)

			console.log('Address created successfully:', address)
			return this.transformResponse(address)
		} catch (error) {
			console.error('Error creating address:', error)
			return ctx.badRequest('Ошибка при создании адреса', {
				details: error.message,
			})
		}
	},

	// Переопределяем метод update для обработки основного адреса
	async update(ctx) {
		console.log('=== UPDATE ADDRESS ===')
		console.log('Request params:', ctx.params)
		console.log('Request body:', ctx.request.body)
		console.log('User ID:', ctx.state.user?.id)

		const { id } = ctx.params
		const { data } = ctx.request.body
		const userId = ctx.state.user.id

		// Проверяем, принадлежит ли адрес текущему пользователю
		console.log('Checking address ownership...')
		const address = await strapi.entityService.findOne(
			'api::address.address',
			id,
			{
				populate: {
					user: {
						fields: [
							'id',
							'username',
							'email',
							'provider',
							'confirmed',
							'blocked',
						],
					},
				},
			}
		)

		console.log('Found address:', address)

		if (!address || address.user.id !== userId) {
			console.log('Access denied: address not found or not owned by user')
			return ctx.forbidden('Вы не можете редактировать этот адрес')
		}

		// Если адрес становится основным, сбрасываем флаг у других адресов
		if (data.is_default) {
			console.log('Setting as default address, resetting other defaults...')
			await strapi.entityService
				.findMany('api::address.address', {
					filters: { user: userId, id: { $ne: id }, is_default: true },
				})
				.then(async (addresses) => {
					for (const addr of addresses) {
						await strapi.entityService.update('api::address.address', addr.id, {
							data: { is_default: false },
						})
					}
				})
		}

		try {
			// Обновляем адрес напрямую через entityService
			console.log('Updating address with data:', data)
			const updatedAddress = await strapi.entityService.update(
				'api::address.address',
				id,
				{
					data,
					populate: {
						user: {
							fields: [
								'id',
								'username',
								'email',
								'provider',
								'confirmed',
								'blocked',
							],
						},
					},
				}
			)

			console.log('Address updated successfully:', updatedAddress)
			return this.transformResponse(updatedAddress)
		} catch (error) {
			console.error('Error updating address:', error)
			return ctx.badRequest('Ошибка при обновлении адреса', {
				details: error.message,
			})
		}
	},

	// Переопределяем метод find для получения только своих адресов
	async find(ctx) {
		console.log('=== FIND ADDRESSES ===')
		console.log('User ID:', ctx.state.user?.id)
		console.log('Query params:', ctx.query)

		const userId = ctx.state.user.id

		try {
			console.log('Fetching addresses for user:', userId)
			const addresses = await strapi.entityService.findMany(
				'api::address.address',
				{
					filters: { user: userId },
					populate: {
						user: {
							fields: [
								'id',
								'username',
								'email',
								'provider',
								'confirmed',
								'blocked',
							],
						},
					},
				}
			)

			console.log('Found addresses:', addresses)
			return this.transformResponse(addresses)
		} catch (error) {
			console.error('Ошибка при поиске адреса:', error)
			return ctx.badRequest('Ошибка при поиске адреса')
		}
	},

	// Переопределяем метод findOne для проверки доступа
	async findOne(ctx) {
		console.log('=== FIND ONE ADDRESS ===')
		console.log('Request params:', ctx.params)
		console.log('User ID:', ctx.state.user?.id)

		const { id } = ctx.params
		const userId = ctx.state.user.id
		console.log(`id: ${id}; userId: ${userId}`)

		try {
			// Проверяем, является ли id числовым значением
			const numericId = parseInt(id, 10)
			let address = null

			if (!isNaN(numericId)) {
				// Если id числовой, ищем адрес по числовому id
				console.log('Searching by numeric ID:', numericId)
				address = await strapi.entityService.findOne(
					'api::address.address',
					numericId,
					{
						filters: { user: userId },
						populate: {
							user: {
								fields: [
									'id',
									'username',
									'email',
									'provider',
									'confirmed',
									'blocked',
								],
							},
						},
					}
				)
			} else {
				// Если id не числовой, используем старую логику поиска
				console.log('Searching by string ID:', id)
				address = await strapi.entityService.findOne(
					'api::address.address',
					id,
					{
						filters: { user: userId },
						populate: {
							user: {
								fields: [
									'id',
									'username',
									'email',
									'provider',
									'confirmed',
									'blocked',
								],
							},
						},
					}
				)
			}

			console.log('Found address:', address)

			if (!address) {
				console.log('Address not found or not owned by user')
				return ctx.notFound(
					'Адрес не найден или не принадлежит текущему пользователю'
				)
			}

			return this.transformResponse(address)
		} catch (error) {
			console.error('Ошибка при поиске адреса:', error)
			return ctx.badRequest('Ошибка при поиске адреса')
		}
	},

	// Переопределяем метод delete для проверки доступа
	async delete(ctx) {
		console.log('=== DELETE ADDRESS ===')
		console.log('Request params:', ctx.params)
		console.log('User ID:', ctx.state.user?.id)

		const { id } = ctx.params
		const userId = ctx.state.user.id

		// Проверяем, принадлежит ли адрес пользователю
		console.log('Checking address ownership...')
		const address = await strapi.entityService.findOne(
			'api::address.address',
			id,
			{
				populate: {
					user: {
						fields: [
							'id',
							'username',
							'email',
							'provider',
							'confirmed',
							'blocked',
						],
					},
				},
			}
		)

		console.log('Found address:', address)

		if (!address || address.user.id !== userId) {
			console.log('Access denied: address not found or not owned by user')
			return ctx.forbidden('Вы не можете удалить этот адрес')
		}

		// Если все проверки пройдены, вызываем стандартный обработчик
		console.log('Calling super.delete...')
		return await super.delete(ctx)
	},

	// Собственный метод для установки адреса по умолчанию
	async setDefault(ctx) {
		console.log('=== SET DEFAULT ADDRESS ===')
		console.log('Request params:', ctx.params)
		console.log('User ID:', ctx.state.user?.id)

		try {
			const { id } = ctx.params
			const userId = ctx.state.user.id

			console.log('Fetching target address...')
			const targetAddress = await strapi.entityService.findOne(
				'api::address.address',
				id,
				{
					populate: {
						user: {
							fields: [
								'id',
								'username',
								'email',
								'provider',
								'confirmed',
								'blocked',
							],
						},
					},
				}
			)

			console.log('Target address:', targetAddress)

			if (!targetAddress || targetAddress.user.id !== userId) {
				console.log(
					'Access denied. Target address user ID:',
					targetAddress?.user?.id
				)
				return ctx.forbidden('Вы не можете установить этот адрес как основной')
			}

			console.log('Finding default addresses...')
			const defaultAddresses = await strapi.entityService.findMany(
				'api::address.address',
				{
					filters: { user: userId, id: { $ne: id }, is_default: true },
				}
			)

			console.log('Found default addresses:', defaultAddresses)

			// Сбрасываем флаг is_default у всех остальных адресов
			await Promise.all(
				defaultAddresses.map((addr) =>
					strapi.entityService.update('api::address.address', addr.id, {
						data: { is_default: false },
					})
				)
			)

			console.log('Setting new default address...')
			const updatedAddress = await strapi.entityService.update(
				'api::address.address',
				id,
				{
					data: { is_default: true },
				}
			)

			console.log('Updated address:', updatedAddress)
			return this.transformResponse(updatedAddress)
		} catch (error) {
			console.error('Error setting default address:', error)
			return ctx.badRequest('Ошибка при установке адреса по умолчанию')
		}
	},
}))
