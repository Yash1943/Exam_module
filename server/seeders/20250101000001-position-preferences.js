'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('position_preferences', [
      {
        id: 1,
        name: 'software_developer',
        category: 'Software Developer',
        description: 'Develop and maintain software applications',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 2,
        name: 'data_analyst',
        category: 'Data Analyst',
        description: 'Analyze and interpret complex data sets',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 3,
        name: 'ui_ux_designer',
        category: 'UI/UX Designer',
        description: 'Design user interfaces and user experiences',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 4,
        name: 'project_manager',
        category: 'Project Manager',
        description: 'Manage and coordinate project activities',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 5,
        name: 'quality_assurance',
        category: 'Quality Assurance',
        description: 'Test and ensure software quality',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 6,
        name: 'devops_engineer',
        category: 'DevOps Engineer',
        description: 'Manage development and operations processes',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 7,
        name: 'business_analyst',
        category: 'Business Analyst',
        description: 'Analyze business requirements and processes',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 8,
        name: 'technical_writer',
        category: 'Technical Writer',
        description: 'Create technical documentation and content',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('position_preferences', null, {});
  }
};