'use strict';

module.exports = (sequelize, DataTypes) => {

  const expedisi = sequelize.define('expedisis', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
 
  }, {
    tableName: "expedisis"
  });

  expedisi.associate = function(models) {

    expedisi.hasMany(models.transaksis,{ onDelete: 'cascade' },{ constraints: true}, { foreginKey: "expedisi"})

  };

  return expedisi;
};