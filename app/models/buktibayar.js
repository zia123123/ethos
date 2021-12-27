'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class buktibayar extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  buktibayar.init({
    link: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'buktibayar',
  });
  return buktibayar;
};module.exports = (sequelize, DataTypes) => {

  const buktibayar = sequelize.define('buktibayars', {
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
    tableName: "buktibayars"
  });
  buktibayar.associate = function(models) {
    buktibayar.belongsTo(models.transaksis, { foreignKey: "transaksisId"})
  };

  return daexpedisi;
};
  