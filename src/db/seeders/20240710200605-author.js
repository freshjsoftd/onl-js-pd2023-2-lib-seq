'use strict';

const { authors } = require('../../constants');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Authors', authors, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Authors', null, {});
  },
};
