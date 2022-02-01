'use strict';

module.exports = (sequelize, DataTypes) => {

  const keranjang = sequelize.define('keranjangs', {
    namaproduct: {
      type: DataTypes.STRING
    },
    jumlahproduct: {
      type: DataTypes.INTEGER
    },
    linkdomain: {
      type: DataTypes.STRING
    },
    linkphoto: {
      type: DataTypes.STRING
    },
    weight: {
      type: DataTypes.INTEGER
    },
    price: {
      type: DataTypes.INTEGER
    },
    discount: {
      type: DataTypes.INTEGER
    },
    transaksiId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  }, {
    tableName: "keranjangs"
  });
  keranjang.associate = function(models) {
    keranjang.belongsTo(models.products, { foreginKey: "productId"})
    keranjang.belongsTo(models.customers, { foreginKey: "customerId"})
    keranjang.belongsTo(models.auths, { foreginKey: "csId"})

  };

  return keranjang;
};