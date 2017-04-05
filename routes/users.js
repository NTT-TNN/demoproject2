var express = require('express');
var passport=require('passport');

var router = express.Router();

login=false;

router.get('/',isLoggedIn, function(req, res, next) {
  res.render('home',{message1:req.flash('loginMessage'),message2:req.flash('signupMessage'),login:login});
});

router.get('/nhapdulieu',isLoggedIn, function(req, res, next) {
  res.render('nhapdulieu',{message1:req.flash('loginMessage'),message2:req.flash('signupMessage'),login:login});
});

// router.get('/lecturer',isLoggedIn, function(req, res, next) {
//   res.render('lecturer',{message1:req.flash('loginMessage'),message2:req.flash('signupMessage')});
//   // console.log(req.flash());
// });

router.get('/login',isLoggedIn,function(req,res,next){
  res.render('login.ejs',{message1:req.flash('loginMessage'),message2:req.flash('signupMessage')});
});
router.get('/signup',isLoggedIn,function(req,res){
  res.render('signup.ejs',{message1:req.flash('loginMessage'),message2:req.flash('signupMessage')});
});
// router.get('/profile',isLoggedIn,function(req,res){
//   res.render('profile.ejs',{user:req.user});
// });

router.get('/logout',isLoggedIn,function(req,res){
  req.logout();
  login=false;
  res.redirect('/users');
})

router.post('/login',passport.authenticate('local-login',{
  successRedirect: '/users',
  failureRedirect: '/',
  failureFlash: true,
}))

router.post('/signup',passport.authenticate('local-signup',{
  successRedirect:'/users/',
  failureRedirect:'/',
  failureFlash:true,
}));

// router.get('/admin', function(req, res, next) {
//   res.render('loginAdmin',{message1:req.flash('loginMessage'),message2:req.flash('signupMessage')});
// });

// router.get('/adminHome',isLoggedInAdmin, function(req, res, next) {
//   res.render('homeAdmin',{message1:req.flash('loginMessage'),message2:req.flash('signupMessage')});
// });
// router.post('/admin/login',passport.authenticate('local-login-admin',{
//   successRedirect:'/users/adminHome',
//   failureRedirect:'/users/admin',
//   failureFlash:true,
// }));

module.exports = router;

function isLoggedIn(req,res,next){
  if(req.isAuthenticated()){
    login=true;
    return next();
  }
  res.redirect('/');
}

// function isLoggedInAdmin(req,res,next){
//   if(req.isAuthenticated()){
//     return next();
//   }
//   res.redirect('/users/admin');
// }
