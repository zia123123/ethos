'use strict';

module.exports = (sequelize, DataTypes) => {

  const province = sequelize.define('provinces', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
 
  }, {
    tableName: "provinces"
  });

  province.associate = function(models) {


  };

  return province;
};