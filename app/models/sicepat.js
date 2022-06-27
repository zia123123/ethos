'use strict';

module.exports = (sequelize, DataTypes) => {
  const sicepat = sequelize.define('sicepat', {
    kecamatan: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    kota: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    cilacap: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    kosambi: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    tandes: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  }, {
    tableName: "sicepat"
  });
  sicepat.associate = function(models) {
  };

  return sicepat;
};