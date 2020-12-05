const bcrypt = require('bcryptjs')
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID

const { User, Comment, Restaurant, Favorite, Like, Followship } = require('../models/index')
const helpers = require('../_helpers')

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
      let userProfile = await User.findByPk(req.params.id, {
        include: [
          { model: Comment, include: [Restaurant] },
          { model: Restaurant, as: 'FavoritedRestaurants' },
          { model: User, as: 'Followers' },
          { model: User, as: 'Followings' },
        ]
      })
      userProfile = userProfile.toJSON()
      userProfile.isFollowed = userProfile.Followers.map(d => d.id).includes(helpers.getUser(req).id)

      //remove comments of same restaurant
      const commentsOfUniqueRestaurants = userProfile.Comments.filter((elem, index, self) =>
        self.findIndex(selfElem => selfElem.RestaurantId === elem.RestaurantId) === index
      )
      const commentCount = commentsOfUniqueRestaurants.length
      const favoriteCount = userProfile.FavoritedRestaurants.length
      const followingCount = userProfile.Followings.length
      const followerCount = userProfile.Followers.length

      res.render('profile', { userProfile, commentCount, favoriteCount, followingCount, followerCount, commentsOfUniqueRestaurants })
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
      res.redirect('back')
    } catch (err) {
      console.log(err)
      next(err)
    }
  },
  removeFavorite: async (req, res, next) => {
    try {
      const targetFavorite = await Favorite.findOne({ where: { RestaurantId: req.params.RestaurantId, UserId: req.user.id } })
      await targetFavorite.destroy()
      res.redirect('back')
    } catch (err) {
      console.log(err)
      next(err)
    }
  },
  likeRestaurant: async (req, res, next) => {
    try {
      await Like.create({ UserId: helpers.getUser(req).id, RestaurantId: req.params.RestaurantId })
      res.redirect('back')
    } catch (err) {
      console.log(err)
      next(err)
    }
  },
  unlikeRestaurant: async (req, res, next) => {
    try {
      const targetLike = await Like.findOne({ where: { UserId: helpers.getUser(req).id, RestaurantId: req.params.RestaurantId } })
      await targetLike.destroy()
      res.redirect('back')
    } catch (err) {
      console.log(err)
      next(err)
    }
  },
  getTopUser: async (req, res, next) => {
    try {
      let users = await User.findAll({ include: [{ model: User, as: 'Followers' }] })
      users = users.map(user => ({
        ...user.dataValues,
        FollowerCount: user.Followers.length,
        isFollowed: req.user.Followings.map(d => d.id).includes(user.id)
      }))
      users = users.sort((a, b) => b.FollowerCount - a.FollowerCount)
      res.render('topUser', { users })
    } catch (err) {
      console.log(err)
      next(err)
    }
  },
  addFollowing: async (req, res, next) => {
    try {
      await Followship.create({ followerId: req.user.id, followingId: req.params.userId })
      res.redirect('back')
    } catch (err) {
      console.log(err)
      next(err)
    }
  },
  removeFollowing: async (req, res, next) => {
    try {
      const targetFollowship = await Followship.findOne({ where: { followerId: req.user.id, followingId: req.params.userId } })
      await targetFollowship.destroy()
      res.redirect('back')
    } catch (err) {
      console.log(err)
      next(err)
    }
  }
}

module.exports = userController