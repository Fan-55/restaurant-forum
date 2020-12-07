const { Category } = require('../models/index')

module.exports = {
  getCategories: async (req, res, next, callback) => {
    try {
      const categories = await Category.findAll({ raw: true, nest: true })
      if (req.params.id) {
        const selectedCategory = categories.find(category => category.id.toString() === req.params.id)
        return res.render('admin/categories', { categories, category: selectedCategory })
      }
      callback({ categories })
    } catch (err) {
      console.log(err)
      next(err)
    }
  },
  postCategory: async (req, res, next, callback) => {
    try {
      const { name } = req.body
      if (!name) {
        return callback({ status: 'error', message: '沒有輸入餐廳種類' })
      } else {
        const newCategory = await Category.create({ name })
        callback({ status: 'success', message: `成功新增餐廳種類:${newCategory.dataValues.name}` })
      }
    } catch (err) {
      console.log(err)
      next(err)
    }
  }
}