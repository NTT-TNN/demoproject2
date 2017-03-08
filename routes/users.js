var express = require('express');
var passport=require('passport');

var router = express.Router();
// login=false;
/* GET users listing. */
router.get('/',isLoggedIn, function(req, res, next) {
  res.render('home',{message1:req.flash('loginMessage'),message2:req.flash('signupMessage')});
  // console.log(req.flash());
});

router.get('/login',isLoggedIn,function(req,res,next){
  res.render('login.ejs',{message:req.flash('loginMessage')});
});

router.get('/signup',isLoggedIn,function(req,res){
  res.render('signup.ejs',{message: req.flash('signupMessage')});
});

router.get('/profile',isLoggedIn,function(req,res){
  res.render('profile.ejs',{user:req.user});
});

router.get('/logout',isLoggedIn,function(req,res){
  req.logout();
  // login=false;
  res.redirect('/users');
})

router.post('/signup',passport.authenticate('local-signup',{
  successRedirect:'/users',
  failureRedirect:'/',
  failureFlash:true,
}));

router.post('/login',passport.authenticate('local-login',{
  successRedirect: '/users',
  failureRedirect: '/',
  failureFlash: true,
}))

router.get('/auth/facebook', passport.authenticate('facebook', { scope: 'email' }));

router.get('/auth/facebook/callback', passport.authenticate('facebook', {
  successRedirect: '/users',
  failureRedirect: '/users/login',
}));

router.get('/auth/twitter', passport.authenticate('twitter'));

router.get('/auth/twitter/callback', passport.authenticate('twitter', {
  successRedirect: '/users',
  failureRedirect: '/users/login',
}));


module.exports = router;

function isLoggedIn(req,res,next){
  if(req.isAuthenticated()){
    // login=true;
    return next();
  }
  res.redirect('/');
}
