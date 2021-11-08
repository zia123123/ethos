'use strict';

module.exports = (sequelize, DataTypes) => {

  const keranjang = sequelize.define('keranjangs', {
    namaproduct: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    jumlah: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    domain: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {
    tableName: "keranjangs"
  });

  keranjang.associate = function(models) {
  
  };

  return keranjang;
};
