const db = require('../models/index')
const Category = db.Category

module.exports = {
  getCategories: (req, res) => {
    Category.findAll({
      raw: true,
      nest: true
    }).then(categories => {
      if (req.params.id) {
        Category.findByPk(req.params.id)
          .then((category) => {
            return res.render('admin/categories', {
              categories: categories,
              category: category.toJSON()
            })
          })
      } else {
        return res.render('admin/categories', { categories: categories })
      }
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
  },
  putCategory: (req, res) => {
    if (!req.body.name) {
      req.flash('error_messages', 'name didn\'t exist')
      return res.redirect('back')
    } else {
      return Category.findByPk(req.params.id)
        .then((category) => {
          category.update(req.body)
            .then((category) => {
              res.redirect('/admin/categories')
            })
        })
    }
  },
}