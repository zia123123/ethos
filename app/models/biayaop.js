'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class biayaop extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  biayaop.init({
    type: DataTypes.INTEGER,
    nama: DataTypes.STRING,
    keterangan: DataTypes.STRING,
    jumlahtagihan: DataTypes.INTEGER,
    tanggal: DataTypes.STRING,
    createdAt: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'biayaop',
  });
  return biayaop;
};