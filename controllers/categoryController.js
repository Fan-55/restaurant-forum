const { Category } = require('../models/index')
const categoryService = require('../services/categoryService')

module.exports = {
  //"GET /admin/categories" uses this controller to render all categories
  //"GET /admin/categories/:id" uses this controller to render edit category name page
  getCategories: (req, res, next) => {
    categoryService.getCategories(req, res, next, (data) => {
      res.render('admin/categories', data)
    })
  },
  //add new category to the list
  postCategory: (req, res, next) => {
    categoryService.postCategory(req, res, next, (data) => {
      if (data.status === 'error') {
        req.flash('error_messages', data.message)
        return res.redirect('/admin/categories')
      }

      if (data.status === 'success') {
        req.flash('success_messages', data.message)
        return res.redirect('/admin/categories')
      }
    })
  },
  //modify existed category's name
  putCategory: (req, res, next) => {
    categoryService.putCategory(req, res, next, (data) => {
      if (data.status === 'error') {
        req.flash('error_messages', data.message)
      }
      if (data.status === 'success') {
        req.flash('success_messages', data.message)
      }
      return res.redirect('/admin/categories')
    })
  },
  //delete existed category
  deleteCategory: (req, res, next) => {
    categoryService.deleteCategory(req, res, next, (data) => {
      if (data.status === 'success') {
        req.flash('success_messages', data.message)
        return res.redirect('/admin/categories')
      }
    })
  }
}