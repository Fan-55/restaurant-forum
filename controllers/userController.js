const bcrypt = require('bcryptjs')
const db = require('../models/index')
const User = db.User

const userController = {
  signUpPage: (req, res) => {
    return res.render('signup')
  },
  signUp: (req, res) => {
    if (req.body.passwordCheck !== req.body.password) {
      req.flash('error_messages', '兩次密碼輸入不同！')
      return res.redirect('/signup')
    } else {
      User.findOne({ where: { email: req.body.email } })
        .then((user) => {
          if (user) {
            req.flash('error_messages', '信箱重複')
            return res.redirect('/signup')
          } else {
            User.create({
              name: req.body.name,
              email: req.body.email,
              password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10), null)
            })
              .then(user => {
                req.flash('success_messages', '成功註冊帳號！')
                return res.redirect('/signin')
              })
          }
        })
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
    res.redirect('/signin')
  },
  getUser: async (req, res) => {
    let user = await User.findByPk(req.params.id)
    user = user.toJSON()
    res.render('profile', { user })
  },
  editUser: async (req, res) => {
    let user = await User.findByPk(req.params.id)
    user = user.toJSON()
    res.render('editProfile', { user })
  }
}

module.exports = userController