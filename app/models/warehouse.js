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
  }, {
    tableName: "warehouses"
  });

  warehouse.associate = function(models) {
    warehouse.belongsTo(models.cityregencies,{ onDelete: 'cascade' },{ constraints: true}, { foreignKey: "cityregencyId"})
    //warehouse.belongsTo(models.provinces,{ onDelete: 'cascade' },{ constraints: true}, { foreignKey: "provinceId"})
    warehouse.belongsTo(models.districts,{ onDelete: 'cascade' },{ constraints: true}, { foreignKey: "districtId"})
    warehouse.hasMany(models.product_stocks,{ onDelete: 'cascade' },{ constraints: true}, { foreginKey: "warehouse"})
    warehouse.hasMany(models.transaksis,{ onDelete: 'cascade' },{ constraints: true}, { foreginKey: "warehouse"})

  };

  return warehouse;
};