var express = require('express');
var passport=require('passport');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('home',{message1:req.flash('loginMessage'),message2:req.flash('signupMessage'),login:login});
});

module.exports = router;
