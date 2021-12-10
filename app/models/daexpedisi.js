module.exports = (sequelize, DataTypes) => {

  const daexpedisi = sequelize.define('daexpedisis', {
    biayatambahan: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    norekening: {
      type: DataTypes.STRING,
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
  