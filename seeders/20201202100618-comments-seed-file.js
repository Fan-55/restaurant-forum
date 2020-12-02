'use strict';

const { random } = require('faker');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const db = require('../models/index')
    const User = db.User
    const Restaurant = db.Restaurant

    let userIds = await User.findAll({ raw: true, nest: true, attributes: ['id'] })
    userIds = userIds.map((item) => { return item.id })

    let restaurantIds = await Restaurant.findAll({ raw: true, nest: true, attributes: ['id'] })
    restaurantIds = restaurantIds.map((item) => { return item.id })

    const seedComments = []
    for (let i = 0; i < 10; i++) {
      const randomUserIndex = Math.floor(Math.random() * userIds.length)
      const randomRestIndex = Math.floor(Math.random() * restaurantIds.length)
      seedComments.push({
        text: 'This is seed comment',
        UserId: userIds[randomUserIndex],
        RestaurantId: restaurantIds[randomRestIndex],
        createdAt: new Date(),
        updatedAt: new Date()
      })
    }
    await queryInterface.bulkInsert('Comments', seedComments, {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Comments', null, {})
  }
};
