'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class dataexpedisi extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  dataexpedisi.init({
    ongkoskirim: DataTypes.INTEGER,
    subsidi: DataTypes.INTEGER,
    biayatambahan: DataTypes.INTEGER,
    norekening: DataTypes.STRING,
    biayacod: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'dataexpedisi',
  });
  return dataexpedisi;
};