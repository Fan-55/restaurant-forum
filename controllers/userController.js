const bcrypt = require('bcryptjs')
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID

const { User, Comment, Restaurant, Favorite } = require('../models/index')

const userController = {
  signUpPage: (req, res) => {
    return res.render('signup')
  },
  signUp: async (req, res, next) => {
    try {
      const { name, email, password, passwordCheck } = req.body
      const errors = {}
      //check required attributes
      if (!name.trim()) {
        errors.name = '名稱不可空白'
      }
      if (!email.trim()) {
        errors.email = 'Email不可空白'
      }
      if (!password) {
        errors.password = '密碼不可空白'
      }
      if (passwordCheck !== password) {
        errors.passwordCheck = '密碼和確認密碼不相符'
      }
      //check duplicate email
      const user = await User.findOne({ where: { email }, raw: true, nest: true })
      if (user) {
        errors.userExist = '此Email已註冊'
      }
      //if one of errors exists, go back to signup page
      if (Object.keys(errors).length) {
        return res.render('signup', { errors, info: req.body })
      }
      const hashedPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(10))
      req.body.password = hashedPassword
      await User.create(req.body)
      req.flash('success_messages', '成功註冊帳號，請重新登入')
      res.redirect('/users/signin')
    } catch (err) {
      console.log(err)
      next(err)
    }
  },
  signInPage: (req, res) => {
    return res.render('signin')
  },
  signIn: (req, res) => {
    req.flash('success_messages', '成功登入！')
    res.redirect('/restaurants')
  },
  logout: (req, res) => {
    req.flash('success_messages', '成功登出！')
    req.logout()
    res.redirect('/users/signin')
  },
  getUser: async (req, res, next) => {
    try {
      let userProfile = await User.findByPk(req.params.id, { include: [{ model: Comment, include: [Restaurant] }] })
      userProfile = userProfile.toJSON()
      const commentCount = userProfile.Comments.length
      res.render('profile', { userProfile, commentCount })
    } catch (err) {
      console.log(err)
      next(err)
    }
  },
  editUser: async (req, res, next) => {
    try {
      let userProfile = await User.findByPk(req.params.id)
      userProfile = userProfile.toJSON()
      res.render('editProfile', { userProfile })
    } catch (err) {
      console.log(err)
      next(err)
    }
  },
  putUser: async (req, res, next) => {
    try {
      const { name } = req.body
      //name is required
      if (!name.trim()) {
        req.flash('error_messages', '名稱不能為空白')
        return res.redirect('back')
      }

      //if image file exists, upload to imgur; else, update name only
      const file = req.file
      if (file) {
        imgur.setClientID(IMGUR_CLIENT_ID)
        const uploadToImgur = new Promise((resolve, reject) => {
          imgur.upload(file.path, (err, image) => {
            if (err) {
              reject(err)
            } else {
              resolve(image)
            }
          })
        })
        const image = await uploadToImgur
        const user = await User.findByPk(req.params.id)
        await user.update({ name: name, image: image ? image.data.link : null })
        req.flash('success_messages', `成功修改${user.dataValues.name}`)
        res.redirect(`/users/${req.params.id}`)
      } else {
        const user = await User.findByPk(req.params.id)
        await user.update({ name })
        req.flash('success_messages', `成功修改${user.dataValues.name}`)
        return res.redirect(`/users/${req.params.id}`)
      }
    } catch (err) {
      console.log(err)
      next(err)
    }
  },
  addFavorite: async (req, res, next) => {
    try {
      await Favorite.create({ UserId: req.user.id, RestaurantId: req.params.RestaurantId })
      res.redirect('/restaurants')
    } catch (err) {
      console.log(err)
      next(err)
    }
  },
  removeFavorite: async (req, res, next) => {
    try {
      const targetRestaurant = await Favorite.findOne({ where: { RestaurantId: req.params.RestaurantId, UserId: req.user.id } })
      await targetRestaurant.destroy()
      res.redirect('/restaurants')
    } catch (err) {
      console.log(err)
      next(err)
    }
  }
}

module.exports = userController