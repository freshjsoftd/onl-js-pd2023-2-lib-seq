'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Book extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Book.belongsTo(models.Genre, {foreignKey: 'genre_id'});
      Book.belongsTo(models.Shelf, {foreignKey: 'shelf_id'});
      Book.belongsToMany(models.Author, {
        through: models.authors_books,
      })
    }
  }
  Book.init(
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      genre_id: {
        type: DataTypes.INTEGER,
        // allowNull: false,
      },
      shelf_id: {
        type: DataTypes.INTEGER,
        // allowNull: false,
      },
      description: DataTypes.TEXT,
      image: DataTypes.STRING,
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
      modelName: 'Book',
      tableName: 'books',
      underscored: true,
    }
  );
  return Book;
};
