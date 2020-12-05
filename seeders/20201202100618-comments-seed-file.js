'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const { User, Restaurant } = require('../models/index')

    let userIds = await User.findAll({ raw: true, nest: true, attributes: ['id'] })
    userIds = userIds.map((item) => { return item.id })

    let restaurantIds = await Restaurant.findAll({ raw: true, nest: true, attributes: ['id'] })
    restaurantIds = restaurantIds.map((item) => { return item.id })

    const seedComments = []
    for (let i = 0; i < 50; i++) {
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
