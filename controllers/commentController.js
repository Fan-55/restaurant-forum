const db = require('../models/index')
const Comment = db.Comment

const commentController = {
  postComment: async (req, res, next) => {
    try {
      //check required attribute
      if (!req.body.text.trim()) {
        req.flash('error_messages', '評論不能為空白')
        return res.redirect(`/restaurants/${req.body.restaurantId}`)
      }
      await Comment.create({
        text: req.body.text,
        RestaurantId: req.body.restaurantId,
        UserId: req.user.id
      })
      req.flash('success_messages', '成功建立一筆評論')
      res.redirect(`/restaurants/${req.body.restaurantId}`)
    } catch (err) {
      console.log(err)
      next(err)
    }
  },
  deleteComment: async (req, res, next) => {
    try {
      const comment = await Comment.findByPk(req.params.id)
      await comment.destroy()
      req.flash('success_messages', '成功刪除評論')
      res.redirect(`/restaurants/${comment.dataValues.RestaurantId}`)
    } catch (err) {
      console.log(err)
      next(err)
    }
  }
}

module.exports = commentController