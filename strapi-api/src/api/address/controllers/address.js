'use strict'

/**
 * ЭТАЛОННАЯ МОДЕЛЬ
 * Данная модель является образцом для разработки других моделей в проекте.
 * При возникновении ошибок в других моделях, сверяйтесь с реализацией модели адресов.
 *
 * Ключевые особенности:
 * 1. Правильная структура CRUD операций
 * 2. Проверка владельца для каждой операции
 * 3. Корректная обработка ошибок
 * 4. Правильное использование entityService
 * 5. Четкое определение полей в populate
 * 6. Возврат корректных HTTP статусов
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
		const { data } = ctx.request.body
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
		if (data.is_default) {
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
		const { id } = ctx.params
		const userId = ctx.state.user.id

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

		try {
			// Проверяем, принадлежит ли адрес пользователю
			const address = await strapi.entityService.findOne(
				'api::address.address',
				id,
				{
					populate: {
						user: {
							fields: ['id'],
						},
					},
				}
			)

			if (!address || address.user.id !== userId) {
				return ctx.forbidden('Вы не можете удалить этот адрес')
			}

			// Удаляем адрес
			await strapi.entityService.delete('api::address.address', id)

			// Возвращаем 204 No Content
			return ctx.send({ data: null }, 204)
		} catch (error) {
			console.error('Error deleting address:', error)
			return ctx.badRequest('Ошибка при удалении адреса')
		}
	},

	// Собственный метод для установки адреса по умолчанию
	async setDefault(ctx) {
		try {
			const { id } = ctx.params
			const userId = ctx.state.user.id

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

			if (!targetAddress || targetAddress.user.id !== userId) {
				console.log(
					'Access denied. Target address user ID:',
					targetAddress?.user?.id
				)
				return ctx.forbidden('Вы не можете установить этот адрес как основной')
			}

			const defaultAddresses = await strapi.entityService.findMany(
				'api::address.address',
				{
					filters: { user: userId, id: { $ne: id }, is_default: true },
				}
			)

			// Сбрасываем флаг is_default у всех остальных адресов
			await Promise.all(
				defaultAddresses.map((addr) =>
					strapi.entityService.update('api::address.address', addr.id, {
						data: { is_default: false },
					})
				)
			)

			const updatedAddress = await strapi.entityService.update(
				'api::address.address',
				id,
				{
					data: { is_default: true },
				}
			)

			return this.transformResponse(updatedAddress)
		} catch (error) {
			console.error('Error setting default address:', error)
			return ctx.badRequest('Ошибка при установке адреса по умолчанию')
		}
	},
}))
