'use strict';
module.exports = (sequelize, DataTypes) => {

  const buktibayar = sequelize.define('buktibayars', {
    link: {
      type: DataTypes.STRING,
    },
  }, {
    tableName: "buktibayars"
  });
  buktibayar.associate = function(models) {
    buktibayar.belongsTo(models.transaksis, { foreignKey: "transaksisId"})
  };

  return buktibayar;
};
  