'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    
    return queryInterface.addConstraint(
      'Comments', {
        type: 'FOREIGN KEY',
        name: 'postid-fk-in-comments',
        fields: ['productId'],
        references: {
          table: 'Products',
          field: 'id'
        }
      }
    )
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.removeConstarint(
      'Comments',
      'postid-fk-in-comments'
    )
  }
};
