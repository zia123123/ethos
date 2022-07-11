'use strict';
module.exports = (sequelize, DataTypes) => {

  const view_kabupaten_kota = sequelize.define('view_kabupaten_kota', 
    {
        provinsi: {
            type: DataTypes.STRING
        },
        kabupaten_kota: {
            type: DataTypes.STRING
        },
    }, 
    {
        tableName: "view_kabupaten_kota",
        timestamps: false
    },
  );
  view_kabupaten_kota.associate = function(models) {
    view_kabupaten_kota.belongsTo(models.ekpedisi, { foreignKey: "ekspedisiId"})
    
  };

  view_kabupaten_kota.removeAttribute('id');

  return view_kabupaten_kota;
};
  