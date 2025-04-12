'use strict'

/**
 * address controller
 */

const { createCoreController } = require('@strapi/strapi').factories

module.exports = createCoreController('api::address.address', ({ strapi }) => ({
	// Кастомный метод create
	async create(ctx) {
		const userId = ctx.state.user.id
		const { data } = ctx.request.body

		try {
			// Если адрес устанавливается как основной, сбрасываем флаг у других адресов
			if (data.is_default) {
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
		const { id } = ctx.params
		const { is_default } = ctx.request.body.data || {}
		const userId = ctx.state.user.id

		// Проверяем, принадлежит ли адрес текущему пользователю
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

		if (!address || address.user.id !== userId) {
			return ctx.forbidden('Вы не можете редактировать этот адрес')
		}

		// Если адрес становится основным, сбрасываем флаг у других адресов
		if (is_default) {
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

		// Вызываем стандартный обработчик обновления
		return await super.update(ctx)
	},

	// Переопределяем метод find для получения только своих адресов
	async find(ctx) {
		console.log('find')
		const userId = ctx.state.user.id

		try {
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

			return this.transformResponse(addresses)
		} catch (error) {
			console.error('Ошибка при поиске адреса:', error)
			return ctx.badRequest('Ошибка при поиске адреса')
		}
	},

	// Переопределяем метод findOne для проверки доступа
	async findOne(ctx) {
		console.log('findOne')

		const { id } = ctx.params
		const userId = ctx.state.user.id
		console.log(`id: ${id}; userId: ${userId}`)

		try {
			// Проверяем, является ли id числовым значением
			const numericId = parseInt(id, 10)
			let address = null

			if (!isNaN(numericId)) {
				// Если id числовой, ищем адрес по числовому id
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

			if (!address) {
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
		const { id } = ctx.params
		const userId = ctx.state.user.id

		// Проверяем, принадлежит ли адрес пользователю
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

		if (!address || address.user.id !== userId) {
			return ctx.forbidden('Вы не можете удалить этот адрес')
		}

		// Если все проверки пройдены, вызываем стандартный обработчик
		return await super.delete(ctx)
	},

	// Собственный метод для установки адреса по умолчанию
	async setDefault(ctx) {
		const { id } = ctx.params
		const userId = ctx.state.user.id
		console.log('ahahahha')

		// Проверяем, принадлежит ли адрес пользователю
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

		if (!address || address.user.id !== userId) {
			return ctx.forbidden('Вы не можете изменить этот адрес')
		}

		// Сбрасываем флаг is_default для всех других адресов пользователя
		await strapi.entityService
			.findMany('api::address.address', {
				filters: { user: userId, id: { $ne: id } },
			})
			.then(async (addresses) => {
				for (const addr of addresses) {
					await strapi.entityService.update('api::address.address', addr.id, {
						data: { is_default: false },
					})
				}
			})

		// Устанавливаем текущий адрес как основной
		await strapi.entityService.update('api::address.address', id, {
			data: { is_default: true },
		})

		// Возвращаем обновленный адрес
		const updatedAddress = await strapi.entityService.findOne(
			'api::address.address',
			id
		)
		return ctx.send(updatedAddress)
	},
}))
