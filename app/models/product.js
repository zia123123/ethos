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
    discount: {
      type: DataTypes.INTEGER
    },
    hpp: {
      type: DataTypes.INTEGER
    },
    weight: {
      type: DataTypes.INTEGER
    },
    quantity: {
      type: DataTypes.INTEGER
    },
    sku: {
      type: DataTypes.STRING
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
    product.belongsTo(models.units,{ onDelete: 'cascade' },{ constraints: true}, { foreignKey: "unitId"})
    product.hasMany(models.product_stocks,{ onDelete: 'cascade' },{ constraints: true}, { foreginKey: "product"})
    product.hasMany(models.keranjangs,{ onDelete: 'cascade' },{ constraints: true}, { foreginKey: "product"})
    product.hasMany(models.iklan)
    product.hasMany(models.biayaiklan)
    product.hasMany(models.saldo)
    product.hasMany(models.dropout)
    product.hasMany(models.domains)
    product.hasMany(models.mapprice)
    product.hasMany(models.pengajuanbiaya)
  
  };

  return product;
};