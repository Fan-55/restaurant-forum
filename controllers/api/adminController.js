const { Restaurant, Category } = require('../../models')
const adminService = require('../../services/adminService')

const adminController = {
  getRestaurants: (req, res, next) => {
    adminService.getRestaurants(req, res, next, (data) => {
      res.json(data)
    })
  },
  getRestaurant: (req, res, next) => {
    adminService.getRestaurant(req, res, next, (data) => {
      res.json(data)
    })
  },
  deleteRestaurant: (req, res, next) => {
    adminService.deleteRestaurant(req, res, next, (data) => {
      res.json(data)
    })
  },
  postRestaurant: (req, res, next) => {
    adminService.postRestaurant(req, res, next, (data) => {
      if (data.status === 'error') {
        return res.json({ status: data.status, message: data.message })
      }

      if (data.status === 'success') {
        return res.json(data)
      }
    })
  },
  putRestaurant: (req, res, next) => {
    adminService.putRestaurant(req, res, next, (data) => {
      if (data.status === 'error') {
        return res.json({ status: data.status, message: data.message })
      }

      if (data.status === 'success') {
        return res.json({ status: data.status, message: data.message })
      }
    })
  }
}

module.exports = adminController