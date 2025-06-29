'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      full_name: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      college_name: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      branch: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      aadhar_card_no: {
        type: Sequelize.STRING(12),
        allowNull: false,
        unique: true
      },
      applied_position_preference: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'position_preferences',
          key: 'id'
        }
      },
      prn_no: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      phone_no: {
        type: Sequelize.STRING(20),
        allowNull: true
      },
      email_id: {
        type: Sequelize.STRING(255),
        allowNull: false,
        unique: true
      },
      semester: {
        type: Sequelize.STRING(50),
        allowNull: true
      },
      password: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('users');
  }
};