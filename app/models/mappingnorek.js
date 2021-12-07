'use strict';

module.exports = (sequelize, DataTypes) => {

  const mappingnorek = sequelize.define('mappingnoreks', {
    keterangan: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {
    tableName: "mappingnoreks"
  });

  mappingnorek.associate = function(models) {
    mappingnorek.belongsTo(models.auths, { foreginKey: "authId"})   
    //mappingnorek.belongsTo(models.nomorekenings, { foreginKey: "nomorekeningId"})   
  };

  return mappingnorek;
};

