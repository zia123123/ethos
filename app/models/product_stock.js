'use strict';

module.exports = (sequelize, DataTypes) => {

  const product_stock = sequelize.define('product_stocks', {
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    nopo: {
      type: DataTypes.STRING
    },
    inbound: {
      type: DataTypes.BOOLEAN
    },
    nodeliverorder: {
      type: DataTypes.STRING
    },
    nopurchase: {
      type: DataTypes.STRING
    },
    remark: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {
    tableName: "product_stocks"
  });

  product_stock.associate = function(models) {
    product_stock.belongsTo(models.products, { foreignKey: "productId"})
    product_stock.belongsTo(models.warehouses, { foreignKey: "warehouseId"})

  };

  return product_stock;
};