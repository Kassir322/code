// models/StudyCard.js
const { Model, DataTypes } = require('sequelize')

module.exports = (sequelize) => {
	class StudyCard extends Model {
		static associate(models) {
			// Определяем связи между моделями
			StudyCard.belongsTo(models.Category, {
				foreignKey: 'category_id',
				as: 'category',
			})

			StudyCard.hasMany(models.OrderItem, {
				foreignKey: 'study_card_id',
				as: 'orderItems',
			})

			StudyCard.hasMany(models.Review, {
				foreignKey: 'study_card_id',
				as: 'reviews',
			})
		}
	}

	StudyCard.init(
		{
			id: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				autoIncrement: true,
				allowNull: false,
			},
			title: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			description: {
				type: DataTypes.TEXT,
				allowNull: true,
			},
			price: {
				type: DataTypes.DECIMAL(10, 2),
				allowNull: false,
			},
			quantity: {
				type: DataTypes.INTEGER,
				allowNull: false,
				defaultValue: 0,
			},
			image_url: {
				type: DataTypes.STRING,
				allowNull: true,
			},
			subject: {
				type: DataTypes.STRING,
				allowNull: true,
			},
			school_grades: {
				type: DataTypes.ARRAY(DataTypes.INTEGER),
				allowNull: true,
			},
			card_type: {
				type: DataTypes.STRING,
				allowNull: true,
			},
			number_of_cards: {
				type: DataTypes.INTEGER,
				allowNull: true,
			},
			category_id: {
				type: DataTypes.INTEGER,
				allowNull: false,
				references: {
					model: 'categories',
					key: 'id',
				},
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
			modelName: 'StudyCard',
			tableName: 'study_cards',
			underscored: true,
			timestamps: true,
			createdAt: 'created_at',
			updatedAt: 'updated_at',
		}
	)

	return StudyCard
}
