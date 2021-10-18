'use strict';

module.exports = (sequelize, DataTypes) => {

  const office = sequelize.define('offices', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    sub_district: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phone_number: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
  }, {
    tableName: "offices"
  });
  office.associate = function(models) {
  };

  return office;
};