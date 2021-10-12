require('dotenv').config()

module.exports = {

  // Configuracion de DB
  // username: process.env.DB_USERNAME || "root",
  // password: process.env.DB_PASSWORD ||  "",
  // database: process.env.DB_DATABASE || "evote",
  // host: process.env.DB_HOST ||"127.0.0.1",
  // dialect: process.env.DB_DIALECT || "mysql",


  username: process.env.DB_USERNAME || "ziakasep",
  password: process.env.DB_PASSWORD ||  "@Zia123123",
  database: process.env.DB_DATABASE || "evote",
  host: process.env.DB_HOST ||"45.13.132.252",
  dialect: process.env.DB_DIALECT || "mysql",


  
  //host: process.env.DB_HOST ||"45.13.132.252",
  // Configurar Seeds
  seederStorage: "sequelize",
  seederStorageTableName: "seeds",

  // Configuracion de Migrations
  migrationStorage: "sequelize",
  migrationStorageTableName: "migrations"

}