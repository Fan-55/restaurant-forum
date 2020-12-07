const db = require('../models/index')
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
  postRestaurant: async (req, res, next) => {
    try {
      //check required attributes
      const restaurant = req.body
      const errors = {}
      if (!restaurant.name.trim()) {
        errors.name = '餐廳名稱不能空白'
      }
      if (!restaurant.CategoryId) {
        errors.CategoryId = '餐廳種類不能空白'
      }
      if (Object.keys(errors).length) {
        const categories = await Category.findAll({ raw: true, nest: true })
        restaurant.CategoryId = Number(restaurant.CategoryId)
        return res.render('admin/create', { errors, categories, restaurant })
      }

      //if restaurant image file exists, create new restaurant with image; else create restaurant without image
      const file = req.file
      if (file) {
        imgur.setClientID(IMGUR_CLIENT_ID);
        const uploadToImgur = new Promise((resolve, reject) => {
          imgur.upload(file.path, (err, image) => {
            if (err) {
              reject(err)
            } else {
              resolve(image)
            }
          })
        })
        const image = await uploadToImgur
        restaurant.image = image ? image.data.link : null
        const newRestaurant = await Restaurant.create(restaurant)
        req.flash('success_messages', `成功建立餐廳: ${newRestaurant.dataValues.name}`)
        return res.redirect('/admin/restaurants')
      } else {
        restaurant.image = null
        const newRestaurant = await Restaurant.create(restaurant)
        req.flash('success_messages', `成功建立餐廳: ${newRestaurant.dataValues.name}`)
        return res.redirect('/admin/restaurants')
      }
    } catch (err) {
      console.log(err)
      next(err)
    }
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
  putRestaurant: async (req, res, next) => {
    try {
      const restaurant = req.body
      const errors = {}
      if (!restaurant.name.trim()) {
        errors.name = '餐廳名稱不能空白'
      }
      if (!restaurant.CategoryId) {
        errors.CategoryId = '餐廳種類不能空白'
      }
      if (Object.keys(errors).length) {
        const categories = await Category.findAll({ raw: true, nest: true })
        restaurant.CategoryId = Number(restaurant.CategoryId)
        return res.render('admin/create', { errors, categories, restaurant })
      }

      const file = req.file
      if (file) {
        imgur.setClientID(IMGUR_CLIENT_ID);
        const uploadToImgur = new Promise((resolve, reject) => {
          imgur.upload(file.path, (err, image) => {
            if (err) {
              reject(err)
            } else {
              resolve(image)
            }
          })
        })
        const image = await uploadToImgur
        restaurant.image = image ? image.data.link : null
        const targetRestaurant = await Restaurant.findByPk(req.params.id)
        await targetRestaurant.update(restaurant)
        req.flash('success_messages', `成功編輯餐廳: ${targetRestaurant.dataValues.name}`)
        res.redirect(`/admin/restaurants`)
      }
      else {
        const targetRestaurant = await Restaurant.findByPk(req.params.id)
        await targetRestaurant.update(restaurant)
        req.flash('success_messages', `成功編輯餐廳: ${targetRestaurant.dataValues.name}`)
        res.redirect(`/admin/restaurants`)
      }
    } catch (err) {
      console.log(err)
      next(err)
    }
  },

  deleteRestaurant: async (req, res, next) => {
    try {
      const restaurant = await Restaurant.findByPk(req.params.id)
      await restaurant.destroy()
      req.flash('success_messages', `餐廳: ${restaurant.dataValues.name}已刪除`)
      res.redirect('/admin/restaurants')
    } catch (err) {
      console.log(err)
      next(err)
    }
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