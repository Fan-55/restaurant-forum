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
  deleteCategory: async (req, res, next) => {
    try {
      const targetCategory = await Category.findByPk(req.params.id)
      await targetCategory.destroy()
      req.flash('success_messages', `成功刪除餐廳種類:${targetCategory.dataValues.name}`)
      res.redirect('/admin/categories')
    } catch (err) {
      console.log(err)
      next(err)
    }
  }
}