'use strict';

module.exports = (sequelize, DataTypes) => {

  const dropout = sequelize.define('dropout', {
    jumlahbarang: {
      type: DataTypes.INTEGER
    },
    nomordo: {
      type: DataTypes.STRING,
    },
  }, {
    tableName: "dropouts"
  });

  dropout.associate = function(models) {
    dropout.belongsTo(models.products, { foreginKey: "productId"})
    dropout.belongsTo(models.inbond, { foreginKey: "inbondId"})
  };
  return dropout;
};

