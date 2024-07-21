'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Order.belongsTo(models.Customer, {foreignKey: 'customer_id'});
      Order.belongsToMany(models.Book,{
        through: models.OrdersBooks
      })
    }
  }
  Order.init(
    {
      title: {
        type: DataTypes.STRING,
        unique: true,
      },
      order_date: DataTypes.DATE,
      customer_id: DataTypes.INTEGER,
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
      modelName: 'Order',
      tableName: 'orders',
      underscored: true,
    }
  );
  return Order;
};
