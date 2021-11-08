'use strict';

module.exports = (sequelize, DataTypes) => {

  const jenispaket = sequelize.define('jenispakets', {
    nama: {
      type: DataTypes.STRING,
      allowNull: false,
    },                     
 
  }, {
    tableName: "jenispakets"
  });

  jenispaket.associate = function(models) {
    //cityregency.hasMany(models.customers,{ onDelete: 'cascade' },{ constraints: true}, { foreginKey: "cityregency"})   
  };

  return jenispaket;
};

