'use strict';

module.exports = (sequelize, DataTypes) => {

  const product = sequelize.define('products', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    expiry_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    conversion: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    link: {
      type: DataTypes.STRING
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    interval_year_expiry_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  }, {
    tableName: "products"
  });

  product.associate = function(models) {
    product.belongsTo(models.suppliers,{ onDelete: 'cascade' },{ constraints: true}, { foreignKey: "supplierId"})
    product.hasMany(models.product_stocks,{ onDelete: 'cascade' },{ constraints: true}, { foreginKey: "product"})
    product.hasMany(models.transaksis,{ onDelete: 'cascade' },{ constraints: true}, { foreginKey: "product"})

  };

  return product;
};