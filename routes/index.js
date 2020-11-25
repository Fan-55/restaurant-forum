const restController = require('../controllers/restController')
module.exports = (app) => {

  app.get('/', (req, res) => {
    res.send('Hello World!')
    res.redirect('/restaurants')
  })
}
  app.get('/restaurants', restController.getRestaurants)
