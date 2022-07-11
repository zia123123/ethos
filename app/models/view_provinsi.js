'use strict';
module.exports = (sequelize, DataTypes) => {

  const view_provinsi = sequelize.define('view_provinsi', 
    {
        provinsi: {
            type: DataTypes.STRING
        },
    }, 
    {
        tableName: "view_provinsi",
        timestamps: false
    },
  );
  view_provinsi.associate = function(models) {
    view_provinsi.belongsTo(models.ekpedisi, { foreignKey: "ekspedisiId"})
    
  };

  view_provinsi.removeAttribute('id');

  return view_provinsi;
};
  