const db = require('../models/index')

const Restaurant = db.Restaurant
const User = db.User
const Category = db.Category

const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID

const adminController = {
  getRestaurants: async (req, res, next) => {
    try {
      const restaurants = await Restaurant.findAll({ raw: true, nest: true, include: [Category] })
      res.render('admin/restaurants', { restaurants })
    } catch (err) {
      console.log(err)
      next(err)
    }
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
        req.flash('success_messages', `成功建立餐廳: ${newRestaurant.name}`)
        return res.redirect('/admin/restaurants')
      } else {
        restaurant.image = null
        const newRestaurant = await Restaurant.create(restaurant)
        req.flash('success_messages', `成功建立餐廳: ${newRestaurant.name}`)
        return res.redirect('/admin/restaurants')
      }
    } catch (err) {
      console.log(err)
      next(err)
    }
  },
  getRestaurant: (req, res) => {
    return Restaurant.findByPk(req.params.id, { raw: true, nest: true, include: [Category] })
      .then(restaurant => {
        return res.render('admin/restaurant', { restaurant })
      })
  },
  editRestaurant: (req, res) => {
    Category.findAll({ raw: true, nest: true })
      .then(categories => {
        return Restaurant.findByPk(req.params.id, { raw: true })
          .then(restaurant => {
            return res.render('admin/create', { restaurant, categories })
          })
      })
  },
  putRestaurant: (req, res) => {
    if (!req.body.name) {
      req.flash('error_messages', "name didn't exist")
      return res.redirect('back')
    }

    const { file } = req
    if (file) {
      imgur.setClientID(IMGUR_CLIENT_ID);
      imgur.upload(file.path, (err, img) => {
        return Restaurant.findByPk(req.params.id)
          .then((restaurant) => {
            restaurant.update({
              name: req.body.name,
              tel: req.body.tel,
              address: req.body.address,
              opening_hours: req.body.opening_hours,
              description: req.body.description,
              image: file ? img.data.link : restaurant.image,
              CategoryId: req.body.categoryId
            })
              .then((restaurant) => {
                req.flash('success_messages', 'restaurant was successfully to update')
                res.redirect('/admin/restaurants')
              })
          })
      })
    }
    else {
      return Restaurant.findByPk(req.params.id)
        .then((restaurant) => {
          restaurant.update({
            name: req.body.name,
            tel: req.body.tel,
            address: req.body.address,
            opening_hours: req.body.opening_hours,
            description: req.body.description,
            image: restaurant.image,
            CategoryId: req.body.categoryId
          })
            .then((restaurant) => {
              req.flash('success_messages', 'restaurant was successfully to update')
              res.redirect('/admin/restaurants')
            })
        })
    }
  },

  deleteRestaurant: (req, res) => {
    return Restaurant.findByPk(req.params.id)
      .then((restaurant) => {
        restaurant.destroy()
          .then((restaurant) => {
            res.redirect('/admin/restaurants')
          })
      })
  },
  getUsers: (req, res) => {
    return User.findAll({ raw: true })
      .then(users => {
        return res.render('admin/users', { users })
      })
  },
  putUsers: (req, res) => {
    User.findByPk(req.params.id)
      .then(user => {
        console.log('isAdmin before change role:', user.isAdmin)
        return user.update({
          isAdmin: user.isAdmin ? false : true
        })
      })
      .then((user) => {
        const userRole = user.isAdmin ? 'admin' : 'user'
        req.flash('success_messages', `${user.name}'s role is successfully updated to ${userRole}`)
        res.redirect('/admin/users')
      })
  },

}

module.exports = adminController