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
  }
}