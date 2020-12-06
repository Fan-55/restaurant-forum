const { Restaurant, Category } = require('../../models')

const adminController = {
  getRestaurants: async (req, res, next) => {
    try {
      const restaurants = await Restaurant.findAll({ raw: true, nest: true, include: [Category] })
      res.json({ restaurants })
    } catch (err) {
      console.log(err)
      next(err)
    }
  }
}
module.exports = adminController