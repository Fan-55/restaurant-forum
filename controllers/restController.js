const db = require('../models')
const Restaurant = db.Restaurant
const Category = db.Category

let restController = {
  getRestaurants: async (req, res) => {
    const where = {}
    let categoryId = ''
    if (req.query.categoryId) {
      categoryId = Number(req.query.categoryId)
      where.CategoryId = categoryId
    }
    const categories = await Category.findAll({ raw: true, nest: true })
    let restaurants = await Restaurant.findAll({ raw: true, nest: true, include: [Category], where })
    restaurants = restaurants.map((r) => ({
      ...r,
      description: r.description.substring(0, 50)
    }))
    return res.render('restaurants', { restaurants, categories, categoryId })
  },
  getRestaurant: async (req, res) => {
    const restaurant = await Restaurant.findByPk(req.params.id, { raw: true, nest: true, include: [Category] })
    res.render('restaurant', { restaurant })
  }
}
module.exports = restController