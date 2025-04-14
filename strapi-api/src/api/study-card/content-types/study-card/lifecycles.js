const slugify = require('slugify')

module.exports = {
	beforeCreate(event) {
		const { data } = event.params

		// Если slug не был явно указан, генерируем его из title
		if (data.title && !data.slug) {
			data.slug = slugify(data.title, {
				lower: true, // преобразуем в нижний регистр
				strict: true, // заменяем специальные символы дефисами
				locale: 'ru', // поддержка русской транслитерации
				trim: true, // удаляем пробелы по краям
			})
		}
	},

	beforeUpdate(event) {
		const { data } = event.params

		// Если title обновлен, но slug не указан явно, обновляем slug
		if (data.title && !data.slug) {
			data.slug = slugify(data.title, {
				lower: true,
				strict: true,
				locale: 'ru',
				trim: true,
			})
		}
	},
}
