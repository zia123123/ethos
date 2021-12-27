'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class biayaiklan extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  biayaiklan.init({
    url: DataTypes.STRING,
    namaproduct: DataTypes.STRING,
    biayaiklan: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'biayaiklan',
  });
  return biayaiklan;
};