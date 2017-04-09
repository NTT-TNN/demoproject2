var express = require('express');
var passport=require('passport');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('home',{
    user:req.user,
    message1:req.flash('loginMessage'),
    message2:req.flash('signupMessage'),login:login
  });
});

router.get('/tintuc', function(req, res, next) {
  res.render('tintuc',{
    user:req.user,
    message1:req.flash('loginMessage'),
    message2:req.flash('signupMessage'),login:login
  });
});

module.exports = router;
