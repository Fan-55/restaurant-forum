const db = require('../models')
const Restaurant = db.Restaurant
const Category = db.Category

let restController = {
  getRestaurants: async (req, res) => {
    let restaurants = await Restaurant.findAll({ raw: true, nest: true, include: [Category] })
    restaurants = restaurants.map((r) => ({
      ...r,
      description: r.description.substring(0, 50)
    }))
    return res.render('restaurants', { restaurants })
  },
  getRestaurant: async (req, res) => {
    const restaurant = await Restaurant.findByPk(req.params.id, { raw: true, nest: true, include: [Category] })
    res.render('restaurant', { restaurant })
  }
}
module.exports = restController