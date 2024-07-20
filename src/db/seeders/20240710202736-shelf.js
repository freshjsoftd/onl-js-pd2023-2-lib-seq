'use strict';

const { shelves } = require('../../constants');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Shelves', shelves, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Shelves', null, {});
  },
};
