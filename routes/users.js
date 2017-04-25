var express = require('express');
var passport=require('passport');
var gv = require('../models/giangvien');
var lop = require('../models/lop');
var bodyParser = require('body-parser');
var multer = require('multer');
var XLSX = require('xlsx');

var router = express.Router();

login=false;
var emailGlobal,data;

// tìm tất cả các giáo viên có trong database
gv.find({},function(err,result){
  if(err) throw err;
  if(result){
    data=result;
  }
})

router.use(bodyParser.json());

var storage = multer.diskStorage({ //multers disk storage settings
    destination: function (req, file, cb) {
        cb(null, './uploads/')
    },
    filename: function (req, file, cb) {
        var datetimestamp = Date.now();
        cb(null, file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length -1])
    }
});

var upload = multer({ //multer settings
    storage: storage,
    fileFilter : function(req, file, callback) { //file filter
        if (['xls', 'xlsx'].indexOf(file.originalname.split('.')[file.originalname.split('.').length-1]) === -1) {
            return callback(new Error('Wrong extension type'));
        }
        callback(null, true);
    }
}).single('file');


router.get('/',isLoggedIn, function(req, res, next) {
  emailGlobal=req.user;
  res.render('home',{
    user:req.user,
    message1:req.flash('loginMessage'),
    message2:req.flash('signupMessage'),
    login:login
  });
});

router.get('/login',isLoggedIn,function(req,res,next){
  res.render('login.ejs',{
    user:emailGlobal,
    message1:req.flash('loginMessage'),
    message2:req.flash('signupMessage')
  });
});

router.get('/signup',isLoggedIn,function(req,res){
  res.render('signup.ejs',{
    user:emailGlobal,
    message1:req.flash('loginMessage'),
    message2:req.flash('signupMessage')
  });
});

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

router.get('/nhapdulieu',isLoggedIn, function(req, res, next) {
  gv.find({},function(err,result){
    if(err) throw err;
    if(result){
      data=result;
    }
  })
  res.render('nhapdulieu',{
    gv:data,
    user:emailGlobal,
    message1:req.flash('loginMessage'),
    message2:req.flash('signupMessage'),
    login:login});
});

router.get('/nhapdulieuExcel',isLoggedIn, function(req, res, next) {
  gv.find({},function(err,result){
    if(err) throw err;
    if(result){
      data=result;
    }
  })
  res.render('nhapdulieu',{
    gv:data,
    user:emailGlobal,
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
      res.render('nhapdulieu',{
        gv:data,
        user:emailGlobal,
        message1:req.flash('loginMessage'),
        message2:req.flash('signupMessage'),
        login:login
      });
    }
  })

});

router.post('/nhapdulieuExcel',isLoggedIn, function(req, res, next) {
  upload(req,res,function(err){
    if(err){
         res.json({error_code:1,err_desc:err});
         return;
    }
    /** Multer gives us file info in req.file object */
    if(!req.file){
        res.json({error_code:1,err_desc:"No file passed"});
        return;
    }
		var workbook = XLSX.readFile(req.file.path);

		var sheet_name_list = workbook.SheetNames;
		sheet_name_list.forEach(function(y) {
		    var worksheet = workbook.Sheets[y];
		    var headers = {};
		    var dataExcel = [];
		    for(z in worksheet) {
		        if(z[0] === '!') continue;
		        //parse out the column, row, and value
		        var tt = 0;
		        for (var i = 0; i < z.length; i++) {
		            if (!isNaN(z[i])) {
		                tt = i;
		                break;
		            }
		        };
		        var col = z.substring(0,tt);

		        var row = parseInt(z.substring(tt));

		        var value = worksheet[z].v;

		        //store header names
		        if(row == 1 && value) {
                value=value.replace(/ /g,'');
                value=value.replace('\n','');
		            headers[col] = value;
		            continue;
		        }
		        if(!dataExcel[row]) dataExcel[row]={};
		        dataExcel[row][headers[col]] = value;
		    }
		    //drop those first two rows which are empty
		    dataExcel.shift();
		    dataExcel.shift();


        // hien thi html
        gv.find({},function(err,result){
          if(err) throw err;
          if(result){
            data=result;
            res.render('nhapdulieuExcel',{
              gv:dataExcel,
              user:emailGlobal,
              message1:req.flash('loginMessage'),
              message2:req.flash('signupMessage'),
              login:login
            });
          }
        })
      });
  })
});

router.get('/xemlich',isLoggedIn, function(req, res, next) {
  gv.findOne({'email':emailGlobal.local.email},function(err,result){
    if(err) throw err;
    if(result){
      var temp=result;
      res.render('xemlich',{
        data:temp,
        user:emailGlobal,
        message1:req.flash('loginMessage'),
        message2:req.flash('signupMessage'),
        login:login
      });
    }
  });
});

router.get('/dangkylich',isLoggedIn, function(req, res, next) {
  gv.findOne({'email':emailGlobal.local.email},function(err,result){
    if(err) throw err;
    if(result){
      var temp=result;
      res.render('dangkylich',{
        data:temp,
        user:emailGlobal,
        message1:req.flash('loginMessage'),
        message2:req.flash('signupMessage'),
        login:login
      });
    }
  })

});

module.exports = router;

function isLoggedIn(req,res,next){
  if(req.isAuthenticated()){
    login=true;
    return next();
  }
  res.redirect('/');
}
