const { Restaurant, User, Category } = require('../models/index')
const adminService = require('../services/adminService')

const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID

const adminController = {
  getRestaurants: (req, res, next) => {
    adminService.getRestaurants(req, res, next, (data) => {
      res.render('admin/restaurants', data)
    })
  },
  createRestaurant: async (req, res, next) => {
    try {
      const categories = await Category.findAll({ raw: true, nest: true })
      res.render('admin/create', { categories })
    } catch (err) {
      console.log(err)
      next(err)
    }
  },
  postRestaurant: (req, res, next) => {
    adminService.postRestaurant(req, res, next, (data) => {
      if (data.status === 'error') {
        return res.render('admin/create', {
          errors: data.message,
          categories: data.categories,
          restaurant: data.restaurant
        })
      }

      if (data.status === 'success') {
        req.flash('success_messages', data.message)
        return res.redirect('/admin/restaurants')
      }
    })

  },
  getRestaurant: (req, res, next) => {
    adminService.getRestaurant(req, res, next, (data) => {
      res.render('admin/restaurant', data)
    })
  },
  editRestaurant: async (req, res, next) => {
    try {
      const categories = await Category.findAll({ raw: true, nest: true })
      const restaurant = await Restaurant.findByPk(req.params.id, { raw: true, nest: true })
      res.render('admin/create', { restaurant, categories, isEdit: true })
    } catch (err) {
      console.log(err)
      next(err)
    }
  },
  putRestaurant: (req, res, next) => {
    adminService.putRestaurant(req, res, next, (data) => {
      if (data.status === 'error') {
        return res.render('admin/create', {
          errors: data.message,
          categories: data.categories,
          restaurant: data.restaurant
        })
      }

      if (data.status === 'success') {
        req.flash('success_messages', data.message)
        return res.redirect('/admin/restaurants')
      }
    })
  },

  deleteRestaurant: async (req, res, next) => {
    adminService.deleteRestaurant(req, res, next, (data) => {
      if (data.status === 'success') {
        req.flash('success_messages', data.message)
        res.redirect('/admin/restaurants')
      }
    })
  },
  getUsers: async (req, res, next) => {
    try {
      const users = await User.findAll({ raw: true, nest: true })
      res.render('admin/users', { users })
    } catch (err) {
      console.log(err)
      next(err)
    }
  },
  toggleAdmin: async (req, res, next) => {
    try {
      const user = await User.findByPk(req.params.id)
      await user.update({ isAdmin: user.isAdmin ? false : true })
      const userRole = user.dataValues.isAdmin ? 'admin' : 'user'
      req.flash('success_messages', `${user.dataValues.name}'s role is successfully updated to ${userRole}`)
      res.redirect('/admin/users')
    } catch (err) {
      console.log(err)
      next(err)
    }
  },
}

module.exports = adminController