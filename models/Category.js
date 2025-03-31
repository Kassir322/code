// models/Category.js
const { Model, DataTypes } = require('sequelize')

module.exports = (sequelize) => {
	class Category extends Model {
		static associate(models) {
			// Определяем связи между моделями
			Category.hasMany(models.StudyCard, {
				foreignKey: 'category_id',
				as: 'studyCards',
			})
		}
	}

	Category.init(
		{
			id: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				autoIncrement: true,
				allowNull: false,
			},
			name: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			slug: {
				type: DataTypes.STRING,
				allowNull: false,
				unique: true,
			},
			description: {
				type: DataTypes.TEXT,
				allowNull: true,
			},
			is_active: {
				type: DataTypes.BOOLEAN,
				defaultValue: true,
			},
			created_at: {
				type: DataTypes.DATE,
				allowNull: false,
				defaultValue: DataTypes.NOW,
			},
			updated_at: {
				type: DataTypes.DATE,
				allowNull: false,
				defaultValue: DataTypes.NOW,
			},
		},
		{
			sequelize,
			modelName: 'Category',
			tableName: 'categories',
			underscored: true,
			timestamps: true,
			createdAt: 'created_at',
			updatedAt: 'updated_at',
			hooks: {
				beforeCreate: (category) => {
					// Автоматическое создание slug из названия, если не указан
					if (!category.slug) {
						category.slug = category.name
							.toLowerCase()
							.replace(/\s+/g, '-')
							.replace(/[^\w\-]+/g, '')
							.replace(/\-\-+/g, '-')
							.trim()
					}
				},
			},
		}
	)

	return Category
}
