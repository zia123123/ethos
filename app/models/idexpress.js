'use strict';

module.exports = (sequelize, DataTypes) => {
  const idexpress = sequelize.define('idexpress', {
    kecamatan: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    kota: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    jakarta_reguler: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    surabaya_requler: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    cilacap_reguler: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    jakarta_idlite: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    surabaya_idlite: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    cilacap_idlite: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
  }, {
    tableName: "idexpress"
  });
  idexpress.associate = function(models) {
  };

  return idexpress;
};