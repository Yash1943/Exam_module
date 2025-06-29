module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    fullName: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: 'full_name'
    },
    collegeName: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'college_name'
    },
    branch: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    aadharCardNo: {
      type: DataTypes.STRING(12),
      allowNull: false,
      unique: true,
      field: 'aadhar_card_no'
    },
    appliedPositionPreference: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'applied_position_preference'
    },
    prnNo: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: 'prn_no'
    },
    phoneNo: {
      type: DataTypes.STRING(20),
      allowNull: true,
      field: 'phone_no'
    },
    emailId: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      field: 'email_id',
      validate: {
        isEmail: true
      }
    },
    semester: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      field: 'is_active'
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: 'created_at'
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: 'updated_at'
    }
  }, {
    tableName: 'users',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  return User;
};