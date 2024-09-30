var express = require('express');
var router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'secret';
const jwt = require('jsonwebtoken');



function authenticateToken(req, res, next) {
  if (req.session && req.session.user) {
    return next();
} else {
    return res.redirect('/');
}
}

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('login', { title: 'Express' });
});

router.get('/dashboard',authenticateToken, function(req, res, next) {
  res.render('dashboard', { title: 'Express' });
});

router.get('/employee', authenticateToken, function(req, res, next) {
  res.render('employee', { title: 'Express' });
});

router.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
});});

module.exports = router;
