'use strict';
module.exports = (sequelize, DataTypes) => {

  const view_kecamatan = sequelize.define('view_kecamatan', 
    {
        kecamatan: {
            type: DataTypes.STRING
        },
        kabupaten_kota: {
            type: DataTypes.STRING
        },
    }, 
    {
        tableName: "view_kecamatan",
        timestamps: false
    },
  );
  view_kecamatan.associate = function(models) {
    view_kecamatan.belongsTo(models.ekpedisi, { foreignKey: "ekspedisiId"})
    
  };

  view_kecamatan.removeAttribute('id');

  return view_kecamatan;
};
  