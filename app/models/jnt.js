'use strict';

module.exports = (sequelize, DataTypes) => {
  const jnt = sequelize.define('jnt', {
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
    tandes: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  }, {
    tableName: "jnt"
  });
  jnt.associate = function(models) {
  };

  return jnt;
};