const bcrypt = require('bcryptjs')
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID

const db = require('../models/index')
const User = db.User
const Comment = db.Comment
const Restaurant = db.Restaurant

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
    let userProfile = await User.findByPk(req.params.id, { include: [{ model: Comment, include: [Restaurant] }] })
    userProfile = userProfile.toJSON()
    const commentCount = userProfile.Comments.length
    console.log(userProfile)
    res.render('profile', { userProfile, commentCount })
  },
  editUser: async (req, res) => {
    let userProfile = await User.findByPk(req.params.id)
    userProfile = userProfile.toJSON()
    res.render('editProfile', { userProfile })
  },
  putUser: async (req, res) => {
    const { name } = req.body
    const image = req.file

    //name is required
    if (!name) {
      req.flash('error_messages', '名稱不能為空白')
      return res.redirect('back')
    }

    //if image file exists, upload to imgur; else, update name
    if (image) {
      imgur.setClientID(IMGUR_CLIENT_ID)
      imgur.upload(image.path, async (err, img) => {
        const user = await User.findByPk(req.params.id)
        await user.update({ name: name, image: image ? img.data.link : null })
        req.flash('success_messages', `成功修改${user.name}`)
        return res.redirect(`/users/${req.params.id}`)
      })
    } else {
      const user = await User.findByPk(req.params.id)
      await user.update({ name })
      req.flash('success_messages', `成功修改${user.name}`)
      return res.redirect(`/users/${req.params.id}`)
    }
  }
}

module.exports = userController