'use strict';

module.exports = (sequelize, DataTypes) => {

  const metodepembayaran = sequelize.define('metodepembayarans', {
    nama: {
      type: DataTypes.STRING,
      allowNull: false,
    },
 
  }, {
    tableName: "metodepembayarans"
  });

  metodepembayaran.associate = function(models) {
    // metodepembayaran.hasMany(models.customers,{ onDelete: 'cascade' },{ constraints: true}, { foreginKey: "cityregency"})   
  };

  return metodepembayaran;
};

