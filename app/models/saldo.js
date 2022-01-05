'use strict';

module.exports = (sequelize, DataTypes) => {

  const saldo = sequelize.define('saldo', {
    productId: {
      type: DataTypes.INTEGER
    },
    buktisaldo: {
      type: DataTypes.STRING
    },
    sisasaldo: {
      type: DataTypes.INTEGER
    },
    status: {
      type: DataTypes.STRING
    },
  }, {
    tableName: "saldos"
  });

  saldo.associate = function(models) {
    saldo.belongsTo(models.products, { foreginKey: "productId"})
  };

  return saldo;
};




