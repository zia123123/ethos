module.exports = (sequelize, DataTypes) => {

    const lead = sequelize.define('leads', {
      leads_number: {
        type: DataTypes.STRING,
      },
      no_hp: {
        type: DataTypes.STRING,
      },
      nama: {
        type: DataTypes.STRING,
      },
      sumber: {
        type: DataTypes.STRING,
      },
      type: {
        type: DataTypes.STRING,
      },
    }, {
      tableName: "leads"
    });
    lead.associate = function(models) {
      lead.belongsTo(models.auths, {foreignKey: "authId"}),
      lead.belongsTo(models.products, {foreignKey: "productId"}),
      lead.belongsTo(models.domains, {foreignKey: "domainId"}),
      lead.hasOne(models.customers, {foreignKey: "lead"})
      lead.hasMany(models.transaksis, {foreignKey: "leadsId"})
    };
  
    return lead;
  };
    