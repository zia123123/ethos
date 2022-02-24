'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('auths', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      email: {
        type: Sequelize.STRING,
        unique: true
      },
      nik: {
        type: Sequelize.STRING,
        unique: true
      }, 
      noktp: {
        type: Sequelize.STRING,
        unique: true
      },  
      alamat: {
        type: Sequelize.TEXT,
      }, 
      notelp: {
        type: Sequelize.STRING,
      }, 
      tempatlahir: {
        type: Sequelize.STRING,
      }, 
      jeniskelamin: {
        type: Sequelize.CHAR,
      },
      statuskawin: {
        type: Sequelize.STRING,
      },
      statuskaryawan: {
        type: Sequelize.STRING,
      },
      tanggalmasuk: {
        type: Sequelize.DATE
      },
      tanggalkeluar: {
        type: Sequelize.DATE
      },
      posisi: {
        type: Sequelize.STRING
      },
      level: {
        type: Sequelize.STRING
      },
      namabank: {
        type: Sequelize.STRING
      },
      norekening: {
        type: Sequelize.STRING
      },
      password: {
        type: Sequelize.STRING
      },
      firstname: {
        type: Sequelize.STRING
      },
      role: {
        type: Sequelize.INTEGER
      },
      status: {
        type: Sequelize.BOOLEAN
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('auths');
  }
};