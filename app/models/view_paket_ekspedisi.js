'use strict';
module.exports = (sequelize, DataTypes) => {

  const view_paket_ekspedisi = sequelize.define('view_paket_ekspedisi', 
    {
        paket: {
            type: DataTypes.STRING
        },
    }, 
    {
        tableName: "view_paket_ekspedisi",
        timestamps: false
    },
  );
  view_paket_ekspedisi.associate = function(models) {
    view_paket_ekspedisi.belongsTo(models.ekpedisi, { foreignKey: "ekspedisiId"})
    
  };

  view_paket_ekspedisi.removeAttribute('id');

  return view_paket_ekspedisi;
};
  