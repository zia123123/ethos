'use strict';

module.exports = (sequelize, DataTypes) => {

  const product = sequelize.define('products', {
    sku: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    nama: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  }, {
    tableName: "products"
  });

  product.associate = function(models) {
    product.hasMany(models.prices,{ onDelete: 'cascade' },{ constraints: true}, { foreginKey: "product"})
  
  };

  return product;
};