'use strict';
const bcrypt = require('bcryptjs')
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Users', [{
      email: 'root@example.com',
      password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
      isAdmin: true,
      name: 'root',
      image: `https://loremflickr.com/320/240/corgi?lock=${Math.random() * 50}`,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      email: 'user1@example.com',
      password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
      isAdmin: false,
      name: 'user1',
      image: `https://loremflickr.com/320/240/corgi?lock=${Math.random() * 50}`,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      email: 'user2@example.com',
      password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
      isAdmin: false,
      name: 'user2',
      image: `https://loremflickr.com/320/240/corgi?lock=${Math.random() * 50}`,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      email: 'user3@example.com',
      password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
      isAdmin: false,
      name: 'user3',
      image: `https://loremflickr.com/320/240/corgi?lock=${Math.random() * 100}`,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      email: 'user4@example.com',
      password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
      isAdmin: false,
      name: 'user4',
      image: `https://loremflickr.com/320/240/corgi?lock=${Math.random() * 100}`,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      email: 'user5@example.com',
      password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
      isAdmin: false,
      name: 'user5',
      image: `https://loremflickr.com/320/240/corgi?lock=${Math.random() * 100}`,
      createdAt: new Date(),
      updatedAt: new Date()
    }], {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', null, {})
  }
};
