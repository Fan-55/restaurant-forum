const db = require('../models/index')
const Category = db.Category

module.exports = {
  getCategroies: (req, res) => {
    Category.findAll({ raw: true, nest: true })
      .then(categories => {
        res.render('admin/categories', { categories })
      })
  }
}