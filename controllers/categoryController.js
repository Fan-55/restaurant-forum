const db = require('../models/index')
const Category = db.Category

module.exports = {
  getCategroies: (req, res) => {
    Category.findAll({ raw: true, nest: true })
      .then(categories => {
        res.render('admin/categories', { categories })
      })
  },
  postCategory: (req, res) => {
    const { name } = req.body
    if (!name) {
      req.flash('error_messages', '沒有輸入種類')
      res.redirect('back')
    } else {
      Category.create({ name })
        .then(() => res.redirect('/admin/categories'))
    }
  }
}