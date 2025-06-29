const { Sequelize } = require('sequelize');
const { sequelize } = require('../config/database');

// Import all models
const User = require('./User')(sequelize, Sequelize.DataTypes);
const PositionPreference = require('./PositionPreference')(sequelize, Sequelize.DataTypes);
const ExamAttempt = require('./ExamAttempt')(sequelize, Sequelize.DataTypes);

// Define associations
User.hasMany(ExamAttempt, { foreignKey: 'userId', as: 'examAttempts' });
ExamAttempt.belongsTo(User, { foreignKey: 'userId', as: 'user' });

PositionPreference.hasMany(User, { foreignKey: 'appliedPositionPreference', as: 'users' });
User.belongsTo(PositionPreference, { foreignKey: 'appliedPositionPreference', as: 'positionPreference' });

const db = {
  sequelize,
  Sequelize,
  User,
  PositionPreference,
  ExamAttempt
};

module.exports = db;