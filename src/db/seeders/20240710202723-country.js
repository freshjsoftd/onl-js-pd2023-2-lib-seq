'use strict';

const { countries } = require('../../constants');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Countries', countries, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Countries', null, {});
  },
};
