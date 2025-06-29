module.exports = (sequelize, DataTypes) => {
  const ExamAttempt = sequelize.define('ExamAttempt', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'user_id',
      references: {
        model: 'users',
        key: 'id'
      }
    },
    examType: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: 'exam_type'
    },
    totalMarks: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'total_marks'
    },
    participantEvaluation: {
      type: DataTypes.JSON,
      allowNull: false,
      field: 'participant_evaluation'
    },
    isCompleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: 'is_completed'
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
    tableName: 'exam_attempts',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  return ExamAttempt;
};