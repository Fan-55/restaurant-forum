const db = require('../models')
const Restaurant = db.Restaurant
const Category = db.Category

const pageLimit = 10

let restController = {
  getRestaurants: async (req, res) => {
    let offset = 0
    const where = {}
    let categoryId = ''
    if (req.query.page) {
      offset = (req.query.page - 1) * pageLimit
    }
    if (req.query.categoryId) {
      categoryId = Number(req.query.categoryId)
      where.CategoryId = categoryId
    }
    const categories = await Category.findAll({ raw: true, nest: true })
    let result = await Restaurant.findAndCountAll({ raw: true, nest: true, include: [Category], where, offset, limit: pageLimit })
    let restaurants = result.rows
    restaurants = restaurants.map((r) => ({
      ...r,
      description: r.description.substring(0, 50)
    }))

    const page = Number(req.query.page) || 1
    const pages = Math.ceil(result.count / pageLimit)
    const totalPage = Array.from({ length: pages }).map((item, index) => index + 1)
    let prev = page - 1 < 1 ? 1 : page - 1
    let next = page + 1 > pages ? pages : page + 1

    return res.render('restaurants', { restaurants, categories, categoryId, page, totalPage, prev, next })
  },
  getRestaurant: async (req, res) => {
    const restaurant = await Restaurant.findByPk(req.params.id, { raw: true, nest: true, include: [Category] })
    res.render('restaurant', { restaurant })
  }
}
module.exports = restController