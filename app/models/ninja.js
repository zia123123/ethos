'use strict';

module.exports = (sequelize, DataTypes) => {
  const ninja = sequelize.define('ninja', {
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
    tableName: "ninja"
  });
  ninja.associate = function(models) {
  };

  return ninja;
};