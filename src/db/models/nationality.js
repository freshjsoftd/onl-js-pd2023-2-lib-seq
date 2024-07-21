'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Nationality extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Nationality.hasMany(models.Author, {
        foreignKey: 'nationality_id',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      })
    }
  }
  Nationality.init(
    {
      title: {
        type: DataTypes.STRING,
        unique: true,
      },
      description: DataTypes.TEXT,
      createdAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'Nationality',
      tableName: 'nationalities',
      underscored: true,
    }
  );
  return Nationality;
};
