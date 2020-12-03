const db = require('../models/index')
const Category = db.Category

module.exports = {
  //"GET /admin/categories" uses this controller to render all categories
  //"GET /admin/categories/:id" uses this controller to render edit category name page
  getCategories: async (req, res, next) => {
    try {
      const categories = await Category.findAll({ raw: true, nest: true })
      if (req.params.id) {
        const selectedCategory = categories.find(category => category.id.toString() === req.params.id)
        return res.render('admin/categories', { categories, category: selectedCategory })
      }
      res.render('admin/categories', { categories })
    } catch (err) {
      console.log(err)
      next(err)
    }
  },
  //add new category to the list
  postCategory: async (req, res, next) => {
    try {
      const { name } = req.body
      if (!name.trim()) {
        req.flash('error_messages', '沒有輸入餐廳種類')
        res.redirect('/admin/categories')
      } else {
        const newCategory = await Category.create({ name })
        req.flash('success_messages', `成功新增餐廳種類:${newCategory.dataValues.name}`)
        res.redirect('/admin/categories')
      }
    } catch (err) {
      console.log(err)
      next(err)
    }
  },
  //modify existed category's name
  putCategory: async (req, res, next) => {
    try {
      if (!req.body.name.trim()) {
        req.flash('error_messages', '沒有輸入種類')
        return res.redirect('/admin/categories')
      } else {
        const targetCategory = await Category.findByPk(req.params.id)
        await targetCategory.update(req.body)
        req.flash('success_messages', `成功修改餐廳種類:${targetCategory.dataValues.name}`)
        res.redirect('/admin/categories')
      }
    } catch (err) {
      console.log(err)
      next(err)
    }
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