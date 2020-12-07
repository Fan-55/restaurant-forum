const { Category } = require('../../models/index')
const categoryService = require('../../services/categoryService')

module.exports = {
  //"GET /admin/categories" uses this controller to render all categories
  //"GET /admin/categories/:id" uses this controller to render edit category name page
  getCategories: (req, res, next) => {
    categoryService.getCategories(req, res, next, (data) => {
      res.json(data)
    })
  },
  postCategory: (req, res, next) => {
    categoryService.postCategory(req, res, next, (data) => {
      return res.json(data)
    })
  }
}