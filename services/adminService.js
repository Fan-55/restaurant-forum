const { Restaurant, User, Category } = require('../models/index')
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID

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
  },
  deleteRestaurant: async (req, res, next, callback) => {
    try {
      const restaurant = await Restaurant.findByPk(req.params.id)
      await restaurant.destroy()
      callback({ status: 'success', message: `餐廳: ${restaurant.dataValues.name}已刪除` })
    } catch (err) {
      console.log(err)
      next(err)
    }
  },
  postRestaurant: async (req, res, next, callback) => {
    try {
      //check required attributes
      const restaurant = req.body
      const errors = {}
      if (!restaurant.name) {
        errors.name = '餐廳名稱不能空白'
      }
      if (!restaurant.CategoryId) {
        errors.CategoryId = '餐廳種類不能空白'
      }
      if (Object.keys(errors).length) {
        const categories = await Category.findAll({ raw: true, nest: true })
        restaurant.CategoryId = Number(restaurant.CategoryId)
        return callback({ status: 'error', message: errors, categories, restaurant })
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
        return callback({ status: 'success', message: `成功建立餐廳: ${newRestaurant.dataValues.name}` })
      } else {
        restaurant.image = null
        const newRestaurant = await Restaurant.create(restaurant)
        return callback({ status: 'success', message: `成功建立餐廳: ${newRestaurant.dataValues.name}` })
      }
    } catch (err) {
      console.log(err)
      next(err)
    }
  },
  putRestaurant: async (req, res, next, callback) => {
    try {
      const restaurant = req.body
      const errors = {}
      if (!restaurant.name) {
        errors.name = '餐廳名稱不能空白'
      }
      if (!restaurant.CategoryId) {
        errors.CategoryId = '餐廳種類不能空白'
      }
      if (Object.keys(errors).length) {
        const categories = await Category.findAll({ raw: true, nest: true })
        restaurant.CategoryId = Number(restaurant.CategoryId)
        return callback({ status: 'error', message: errors, categories, restaurant })
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
        return callback({ status: 'success', message: `成功編輯餐廳: ${targetRestaurant.dataValues.name}` })
      }
      else {
        const targetRestaurant = await Restaurant.findByPk(req.params.id)
        await targetRestaurant.update(restaurant)
        return callback({ status: 'success', message: `成功編輯餐廳: ${targetRestaurant.dataValues.name}` })
      }
    } catch (err) {
      console.log(err)
      next(err)
    }
  }
}

module.exports = adminService