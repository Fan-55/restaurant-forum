const db = require('../models')
const Restaurant = db.Restaurant
const Category = db.Category
const Comment = db.Comment
const User = db.User

let restController = {
  getRestaurants: async (req, res, next) => {
    try {
      let CategoryId = ''
      const categories = await Category.findAll({ raw: true, nest: true })

      let offset = 0
      const pageLimit = 10
      if (req.query.page) {
        offset = (req.query.page - 1) * pageLimit
      }

      const where = {}
      if (req.query.CategoryId) {
        CategoryId = Number(req.query.CategoryId)
        where.CategoryId = CategoryId
      }

      let result = await Restaurant.findAndCountAll({ raw: true, nest: true, include: [Category], where, offset, limit: pageLimit })
      let restaurants = result.rows
      restaurants = restaurants.map((r) => ({
        ...r,
        description: r.description.substring(0, 50)
      }))

      const page = Number(req.query.page) || 1 //if query doesn't have page property, meaning it's on the 1st page
      const pages = Math.ceil(result.count / pageLimit) //counts of required pages
      const totalPage = Array.from({ length: pages }).map((item, index) => index + 1) //array of pagination
      let prev = page - 1 < 1 ? 1 : page - 1
      let next = page + 1 > pages ? pages : page + 1

      return res.render('restaurants', { restaurants, categories, CategoryId, page, totalPage, prev, next })
    } catch (err) {
      console.log(err)
      next(err)
    }
  },
  getRestaurant: async (req, res, next) => {
    try {
      const restaurant = await Restaurant.findByPk(req.params.id, { include: [Category, { model: Comment, include: [User] }] })
      await restaurant.increment('viewCounts')
      res.render('restaurant', { restaurant: restaurant.toJSON() })
    } catch (err) {
      console.log(err)
      next(err)
    }
  },
  getFeeds: async (req, res, next) => {
    try {
      const [restaurants, comments] = await Promise.all([
        Restaurant.findAll({ order: [['createdAt', 'DESC']], include: [Category], limit: 10, raw: true, nest: true }),
        Comment.findAll({ order: [['createdAt', 'DESC']], include: [User, Restaurant], limit: 10, raw: true, nest: true })
      ])
      res.render('feeds', { restaurants, comments })
    } catch (err) {
      console.log(err)
      next(err)
    }
  },
  getDashboard: async (req, res, next) => {
    try {
      let restaurant = await Restaurant.findByPk(req.params.id, { include: [Comment, Category] })
      restaurant = restaurant.toJSON()
      res.render('dashboard', { restaurant, commentCount: restaurant.Comments.length })
    } catch (err) {
      console.log(err)
      next(err)
    }
  },
}
module.exports = restController