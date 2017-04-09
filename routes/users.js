var express = require('express');
var passport=require('passport');
var gv = require('../models/giangvien');
var lop = require('../models/lop');


var router = express.Router();

login=false;
var email,data;

gv.find({},function(err,result){
  if(err) throw err;
  if(result){
    data=result;
  }
})
router.get('/',isLoggedIn, function(req, res, next) {
  email=req.user;
  res.render('home',{
    user:req.user,
    message1:req.flash('loginMessage'),
    message2:req.flash('signupMessage'),
    login:login
  });
});

// router.get('/lecturer',isLoggedIn, function(req, res, next) {
//   res.render('lecturer',{message1:req.flash('loginMessage'),message2:req.flash('signupMessage')});
//   // console.log(req.flash());
// });

router.get('/login',isLoggedIn,function(req,res,next){
  res.render('login.ejs',{
    user:email,
    message1:req.flash('loginMessage'),
    message2:req.flash('signupMessage')
  });
});
router.get('/signup',isLoggedIn,function(req,res){
  res.render('signup.ejs',{
    user:email,
    message1:req.flash('loginMessage'),
    message2:req.flash('signupMessage')
  });
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

router.get('/nhapdulieu',isLoggedIn, function(req, res, next) {
  gv.find({},function(err,result){
    if(err) throw err;
    if(result){
      data=result;
    }
  })
  res.render('nhapdulieu',{
    gv:data,
    user:email,
    message1:req.flash('loginMessage'),
    message2:req.flash('signupMessage'),
    login:login});
});

router.post('/nhapdulieu',isLoggedIn, function(req, res, next) {
  gv.findOne({'email':req.body.email},function(err,giangVien){
    if(err) return done(err);
    if(giangVien){
      var temp={
        tenGv:req.body.giang_vien,
        email:req.body.email,
        dienthoai:req.body.dien_thoai,
        tenlop:req.body.ten_lop,
        malop:req.body.ma_lop,
        malopHoc:req.body.ma_lop_hoc,
        soLuongSV:req.body.so_luong_sv,
        maHP:req.body.maHP,
        khoa:req.body.khoa,
        soTinChi:req.body.so_tin_chi,
        thu:null,
        tiet:null,
        thoiGianBatDau:null,
        thoiGianKetThuc:null,
        ghiChu:req.body.ghi_chu
      };

      giangVien.day.push(temp);
      giangVien.save(function(err) {
        if (err)
          throw err;
        console.log("đã tồn tại giảng viên đã thêm lớp mới cho giảng viên ",giangVien.tenGv);
      });
    }else{
      var newGv= new gv();
      newGv.tenGv=req.body.giang_vien;
      newGv.email=req.body.email;
      newGv.dienthoai=req.body.dien_thoai;

      var temp={
        tenGv:req.body.giang_vien,
        email:req.body.email,
        dienthoai:req.body.dien_thoai,
        tenlop:req.body.ten_lop,
        malop:req.body.ma_lop,
        malopHoc:req.body.ma_lop_hoc,
        soLuongSV:req.body.so_luong_sv,
        maHP:req.body.maHP,
        khoa:req.body.khoa,
        soTinChi:req.body.so_tin_chi,
        thu:null,
        tiet:null,
        thoiGianBatDau:null,
        thoiGianKetThuc:null,
        ghiChu:req.body.ghi_chu
      };
      newGv.day.push(temp);
      newGv.save(function(err) {
        if (err)
          throw err;
        console.log('đã thêm giảng viên mới',newGv.tenGv);
      });
    }
  })

  lop.findOne({'malop':req.body.ma_lop},function(err,malop){
    if(err) return done(err);
    if(malop){
      var temp={
        malopHoc:req.body.ma_lop_hoc,
        soLuongSV:req.body.so_luong_sv,
        maHP:req.body.maHP,
        khoa:req.body.khoa,
        soTinChi:req.body.so_tin_chi,
        thu:null,
        tiet:null,
        thoiGianBatDau:null,
        thoiGianKetThuc:null,
        ghiChu:req.body.ghi_chu
      };

      malop.hoc.push(temp);
      malop.save(function(err) {
        if (err)
          throw err;
        console.log("đã tồn tại lớp và đã thêm lớp học cho lớp: ",malop.tenlop);
      });
    }else{
      var newLop= new lop();
      newLop.tenlop=req.body.ten_lop;
      newLop.malop=req.body.ma_lop;
      var temp={
        malopHoc:req.body.ma_lop_hoc,
        soLuongSV:req.body.so_luong_sv,
        maHP:req.body.maHP,
        khoa:req.body.khoa,
        soTinChi:req.body.so_tin_chi,
        thu:null,
        tiet:null,
        thoiGianBatDau:null,
        thoiGianKetThuc:null,
        ghiChu:req.body.ghi_chu
      };
      newLop.hoc.push(temp);
      newLop.save(function(err) {
        if (err)
          throw err;
        console.log('đã thêm lớp mới',newLop.tenlop);
      });
    }
  })
  gv.find({},function(err,result){
    if(err) throw err;
    if(result){
      data=result;
    }
  })
  res.render('nhapdulieu',{
    gv:data,
    user:email,
    message1:req.flash('loginMessage'),
    message2:req.flash('signupMessage'),
    login:login
  });
});

router.get('/xemlich',isLoggedIn, function(req, res, next) {
  res.render('xemlich',{
    user:email,
    message1:req.flash('loginMessage'),
    message2:req.flash('signupMessage'),
    login:login
  });
});

router.get('/dangkylich',isLoggedIn, function(req, res, next) {
  res.render('dangkylich',{
    user:email,
    message1:req.flash('loginMessage'),
    message2:req.flash('signupMessage'),
    login:login
  });
});

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
