// models/Review.js
const { Model, DataTypes } = require('sequelize')

module.exports = (sequelize) => {
	class Review extends Model {
		static associate(models) {
			// Определяем связи между моделями
			Review.belongsTo(models.User, {
				foreignKey: 'user_id',
				as: 'user',
			})

			Review.belongsTo(models.StudyCard, {
				foreignKey: 'study_card_id',
				as: 'studyCard',
			})
		}
	}

	Review.init(
		{
			id: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				autoIncrement: true,
				allowNull: false,
			},
			study_card_id: {
				type: DataTypes.INTEGER,
				allowNull: false,
				references: {
					model: 'study_cards',
					key: 'id',
				},
			},
			user_id: {
				type: DataTypes.INTEGER,
				allowNull: false,
				references: {
					model: 'users',
					key: 'id',
				},
			},
			rating: {
				type: DataTypes.INTEGER,
				allowNull: false,
				validate: {
					min: 1,
					max: 5,
				},
			},
			comment: {
				type: DataTypes.TEXT,
				allowNull: true,
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
			modelName: 'Review',
			tableName: 'reviews',
			underscored: true,
			timestamps: true,
			createdAt: 'created_at',
			updatedAt: 'updated_at',
		}
	)

	return Review
}
