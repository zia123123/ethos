'use strict';

module.exports = (sequelize, DataTypes) => {

  const warehouse = sequelize.define('warehouses', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    expedition_data: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    cityregencyId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    statusGudang: {
      type: DataTypes.BOOLEAN
    },
    postalcode: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    address_line_two: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    village: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    provinceId: {
      type: DataTypes.INTEGER,
    },
    cityregencyId: {
      type: DataTypes.INTEGER,
    },
    internal: {
      type: DataTypes.BOOLEAN
    },
    districtId: {
      type: DataTypes.INTEGER,
    },
  }, {
    tableName: "warehouses"
  });

  warehouse.associate = function(models) {
 
    warehouse.hasMany(models.product_stocks,{ onDelete: 'cascade' },{ constraints: true}, { foreginKey: "warehouse"})
    warehouse.hasMany(models.transaksis,{ onDelete: 'cascade' },{ constraints: true}, { foreginKey: "warehouse"})
    warehouse.belongsTo(models.province , { foreginKey: "provinceId"})
    warehouse.belongsTo(models.cityregencies , { foreginKey: "cityregencyId"})
    warehouse.belongsTo(models.districts , { foreginKey: "districtId"})
    warehouse.hasMany(models.customers)

  };

  return warehouse;
};