'use strict';

module.exports = (sequelize, DataTypes) => {

  const product_stock = sequelize.define('product_stocks', {
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
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
  };

  return product_stock;
};