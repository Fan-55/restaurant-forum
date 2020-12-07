const db = require('../models/index')
const { Restaurant, User, Category } = require('../models/index')

const adminService = {
  getRestaurants: async (req, res, next, callback) => {
    try {
      const restaurants = await Restaurant.findAll({ raw: true, nest: true, include: [Category] })
      callback({ restaurants })
    } catch (err) {
      console.log(err)
      next(err)
    }
  },
  getRestaurant: async (req, res, next, callback) => {
    try {
      const restaurant = await Restaurant.findByPk(req.params.id, { raw: true, nest: true, include: [Category] })
      callback({ restaurant })
    } catch (err) {
      console.log(err)
      next(err)
    }
  }
}

module.exports = adminService