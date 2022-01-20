'use strict';

module.exports = (sequelize, DataTypes) => {

  const catalog = sequelize.define('catalog', {
    jumlahbarang: {
      type: DataTypes.INTEGER
    },
  }, {
    tableName: "catalogs"
  });

  catalog.associate = function(models) {
    catalog.belongsTo(models.products, { foreginKey: "productId"})
  };
  return catalog;
};

