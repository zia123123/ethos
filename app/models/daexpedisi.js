module.exports = (sequelize, DataTypes) => {

  const daexpedisi = sequelize.define('daexpedisis', {
    biayatambahan: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    norekening: {
      type: DataTypes.STRING,
    },
    namabank: {
      type: DataTypes.STRING
    },
    totalharga: {
      type: DataTypes.BIGINT
    }, 
    biayacod: {
      type: DataTypes.INTEGER,
    },
  }, {
    tableName: "daexpedisis"
  });
  daexpedisi.associate = function(models) {
    daexpedisi.belongsTo(models.transaksis, { foreignKey: "transaksisId"})
  };

  return daexpedisi;
};
  