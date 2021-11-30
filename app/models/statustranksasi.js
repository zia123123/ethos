'use strict';

module.exports = (sequelize, DataTypes) => {

  const statustranksasi = sequelize.define('statustranksasis', {
    nama: {
      type: DataTypes.STRING,
      allowNull: false,
    },
 
  }, {
    tableName: "statustranksasis"
  });

  statustranksasi.associate = function(models) {
   
  };

  return statustranksasi;
};

