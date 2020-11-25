const db = require('../models/index')
const Restaurant = db.Restaurant
const adminController = {
  getRestaurants: (req, res) => {
    return Restaurant.findAll({ rew: true })
      .then(restaurants => {
        return res.render('admin/restaurants', { restaurants })
      })
  }
}

module.exports = adminController