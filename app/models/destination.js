'use strict';

module.exports = (sequelize, DataTypes) => {

  const destination = sequelize.define('destination', {
    destination_code: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    subdistrict: {
        type: DataTypes.STRING,
        allowNull: false,
      },
 
  }, {
    tableName: "mytable"
  });

  destination.associate = function(models) {


  };

  return destination;
};