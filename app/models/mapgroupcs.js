'use strict';

module.exports = (sequelize, DataTypes) => {

  const mapgroupcs = sequelize.define('mapgroupcs', {
    keterangan: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    groupcsId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    }
  }, {
    tableName: "mapgroupcs"
  });

  mapgroupcs.associate = function(models) {
    
    mapgroupcs.belongsTo(models.auths,{ onDelete: 'cascade' },{ constraints: true}, { foreginKey: "authId"})
  };

  return mapgroupcs;
};
