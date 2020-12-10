const { Restaurant, Category, Comment, User, Favorite, sequelize } = require('../models')
const helpers = require('../_helpers')
const { QueryTypes } = require('sequelize')

const restController = {
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
      restaurants = restaurants.map(r => ({
        ...r,
        description: r.description.substring(0, 50),
        isFavorite: req.user.FavoritedRestaurants.map(d => d.id).includes(r.id),
        isLiked: req.user.LikedRestaurants.map(d => d.id).includes(r.id)
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
      const restaurant = await Restaurant.findByPk(req.params.id, {
        include: [
          Category,
          { model: Comment, include: [User] },
          { model: User, as: 'FavoritedUsers' },
          { model: User, as: 'LikedUsers' },
        ]
      })
      await restaurant.increment('viewCounts')
      const isFavorite = restaurant.FavoritedUsers.map(d => d.id).includes(helpers.getUser(req).id)
      const isLiked = restaurant.LikedUsers.map(d => d.id).includes(helpers.getUser(req).id)
      res.render('restaurant', { restaurant: restaurant.toJSON(), isFavorite, isLiked })
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
      let restaurant = await Restaurant.findByPk(req.params.id, { include: [Comment, Category, Favorite] })
      restaurant = restaurant.toJSON()
      res.render('dashboard', { restaurant, commentCount: restaurant.Comments.length, favoriteCount: restaurant.Favorites.length })
    } catch (err) {
      console.log(err)
      next(err)
    }
  },
  getTopRestaurant: async (req, res, next) => {
    try {
      let restaurants = await sequelize.query(
        `SELECT id, name, description, image, CategoryId, counts.favoriteCount
        FROM Restaurants
        INNER JOIN (SELECT RestaurantId, COUNT(RestaurantId) AS favoriteCount FROM Favorites GROUP BY RestaurantId) AS counts
        ON counts.RestaurantId = Restaurants.id
        ORDER BY favoriteCount DESC
        LIMIT 10`,
        { type: sequelize.QueryTypes.SELECT }
      )

      console.log(restaurants)

      restaurants = restaurants.map(r => {
        return {
          ...r,
          description: r.description.substring(0, 50),
          isFavorite: req.user.FavoritedRestaurants.map(d => d.id).includes(r.id)
        }
      })
      res.render('topRestaurant', { restaurants })
    } catch (err) {
      console.log(err)
      next(err)
    }
  }
}
module.exports = restController