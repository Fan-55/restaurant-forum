const express = require('express')
const router = express.Router()

const userController = require('../../controllers/userController')
const passport = require('../../config/passport')
const multer = require('multer')
const upload = multer({ dest: 'temp/userAvatar/' })
const { authenticated, isOwnProfile, editOwnProfile } = require('../../middleware/check-auth')

router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp)
router.get('/signin', userController.signInPage)
router.post('/signin', passport.authenticate('local', { failureRedirect: '/users/signin', failureFlash: true }), userController.signIn)
router.get('/logout', userController.logout)
router.get('/:id', authenticated, isOwnProfile, userController.getUser)
router.get('/:id/edit', authenticated, editOwnProfile, userController.editUser)
router.put('/:id', authenticated, upload.single('image'), userController.putUser)

module.exports = router