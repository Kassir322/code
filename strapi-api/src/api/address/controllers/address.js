'use strict'

/**
 * address controller
 */

const { createCoreController } = require('@strapi/strapi').factories

module.exports = createCoreController('api::address.address', ({ strapi }) => ({
	// Переопределяем метод create для автоматической привязки адреса к пользователю
	async create(ctx) {
		// Получаем ID текущего пользователя из контекста запроса
		const userId = ctx.state.user.id

		// Добавляем user в тело запроса
		ctx.request.body.data = {
			...ctx.request.body.data,
			user: userId,
		}

		// Проверяем, устанавливается ли адрес как основной
		if (ctx.request.body.data.is_default) {
			// Если да, сбрасываем флаг is_default для всех других адресов пользователя
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

		// Вызываем стандартный обработчик создания
		return await super.create(ctx)
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
				populate: ['user'],
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
		// Добавляем фильтр по текущему пользователю
		ctx.query = {
			...ctx.query,
			filters: {
				...ctx.query.filters,
				user: ctx.state.user?.id,
			},
		}

		// Вызываем стандартный обработчик поиска
		return await super.find(ctx)
	},

	// Переопределяем метод findOne для проверки доступа
	async findOne(ctx) {
		console.log('Я ЗДЕСЬ')

		const { id } = ctx.params
		console.log(id)

		const userId = ctx.state.user?.documentId
		console.log(userId)

		// Сначала проверяем, принадлежит ли адрес пользователю
		const address = await strapi.entityService.findOne(
			'api::address.address',
			id,
			{
				populate: ['user'],
			}
		)

		if (!address || address.user?.id !== userId) {
			return ctx.forbidden('Вы не можете просматривать этот адрес')
		}

		// Если все проверки пройдены, вызываем стандартный обработчик
		return await super.findOne(ctx)
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
				populate: ['user'],
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

		// Проверяем, принадлежит ли адрес пользователю
		const address = await strapi.entityService.findOne(
			'api::address.address',
			id,
			{
				populate: ['user'],
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
