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
    hpp: {
      type: DataTypes.INTEGER
    },
    supervisor: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    advertiser: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    sku: {
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
    // transaksiId: {
    //   type: DataTypes.BIGINT,
    //   allowNull: false,
    // },
  }, {
    tableName: "keranjangs"
  });
  keranjang.associate = function(models) {
    keranjang.belongsTo(models.products, { foreginKey: "productId"})
    keranjang.belongsTo(models.customers, { foreginKey: "customerId"})
    keranjang.belongsTo(models.auths, { foreginKey: "authId"})
    keranjang.belongsTo(models.transaksis, { foreignKey: "transaksiId", targetKey:'idtransaksi'})

  };

  return keranjang;
};