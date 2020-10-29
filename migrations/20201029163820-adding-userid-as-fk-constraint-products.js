'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    
    // add constraint to product id to be used as foreign id from user table
    return queryInterface.addConstraint(
      'Products' //Products table
        , { 
        type: 'FOREIGN KEY',
        fields: ['userId'],
        name: 'userid-fk-in-products',
        references: { //specify which table userId is referencing to
          table: 'Users',
          field: 'id'
        }
      }
    )

  },

  down: async (queryInterface, Sequelize) => {
    
    return queryInterface.removeConstraint(
      'Products',
      'userid-fk-in-products'
    )

  }
};
