const db = require('../models/index')
const { Restaurant, User, Category } = require('../models/index')

const adminController = {
  getRestaurants: async (req, res, next, callback) => {
    try {
      const restaurants = await Restaurant.findAll({ raw: true, nest: true, include: [Category] })
      callback({ restaurants })
    } catch (err) {
      console.log(err)
      next(err)
    }
  }
}

module.exports = adminController