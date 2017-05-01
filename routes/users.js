var express = require('express');
var passport=require('passport');
var gv = require('../models/giangvien');
var lop = require('../models/lop');
var user = require('../models/user');
var bodyParser = require('body-parser');
var multer = require('multer');
var XLSX = require('xlsx');
const Moment = require('moment');
const MomentRange = require('moment-range');
const moment = MomentRange.extendMoment(Moment);

var router = express.Router();

login=false;
var emailGlobal,data;

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

router.get('/login',isLoggedIn,function(req,res,next){
  res.render('login.ejs',{
    user:emailGlobal,
    message1:req.flash('loginMessage'),
    message2:req.flash('signupMessage')
  });
});

router.get('/profile',isLoggedIn,function(req,res){
  res.render('profile.ejs',{
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
  successRedirect:'/',
  failureRedirect:'/',
  failureFlash:true,
}));

router.get('/nhapdulieu',isLoggedIn, function(req, res, next) {
  var dslop=[],lopAll;
  lop.find({},function(err,result){
    if(err) throw err;
    if(result){
      var lopAll=result;
      for(i=0;i<lopAll.length;++i){
        for(j=0;j<lopAll[i].hoc.length;++j){
            dslop.push(lopAll[i].hoc[j]);
        }
      }
      res.render('nhapdulieu',{
        data:dslop,
        user:emailGlobal,
        message1:req.flash('loginMessage'),
        message2:req.flash('signupMessage'),
        login:login
      });
    }
  })
});

router.get('/nhapdulieuExcel',isLoggedIn, function(req, res, next) {

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
        if (err)throw err;
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

  lop.find({},function(err,result){
    if(err) throw err;
    if(result){
      data=result;
      res.render('nhapdulieu',{
        data:data,
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

        //save to database
        for(i=0;i<dataExcel.length;++i){
          var lopTemp={
            tenlop:dataExcel[i].Khóa,
            maHP:dataExcel[i].Mãhọcphần,
            Tênlớphọcphần:dataExcel[i].Tênlớphọcphần,
            Sốlượng:dataExcel[i].Sốlượng,
            SốTC:dataExcel[i].SốTC,
            Phònghọc:dataExcel[i].Phònghọc,
            Giảngviên:dataExcel[i].Giảngviên,
            Cơquancôngtác:dataExcel[i].Cơquancôngtác,
            Điệnthoạiliênhệ:dataExcel[i].Điệnthoạiliênhệ,
            thu:null,
            tiet:null,
            thoiGianBatDau:null,
            thoiGianKetThuc:null,
            ghiChu:dataExcel[i].ghiChu
          }
          var sync=true;
          lop.findOne({tenlop:dataExcel[i].Khóa},function(err,result){
            if(err) {
              throw err;
              sync=false;
            }
            if(result){
              result.hoc.push(lopTemp);
              result.save(function(err) {
                if (err)throw err;
                console.log("đã tồn tại lớp", result.tenlop, "và đã thêm lớp học : ",lopTemp.Tênlớphọcphần);
                sync=false;
              });
            }else{
              var newLop= new lop();
              newLop.tenlop=dataExcel[i].Khóa;
              newLop.hoc.push(lopTemp);
              newLop.save(function(err) {
                if (err)throw err;
                console.log('đã thêm lớp mới',newLop.tenlop);
                sync=false;
              });
            }

          })
          while(sync) {require('deasync').sleep(100);}
          if(i===dataExcel.length-1){
            res.render('nhapdulieuExcel',{
              gv:dataExcel,
              user:emailGlobal,
              message1:req.flash('loginMessage'),
              message2:req.flash('signupMessage'),
              login:login
            });
          }
        }
      });
  })
});

router.get('/xemlich',isLoggedIn, function(req, res, next) {

  var lopAll,dslop=[];
  var sync=true;
  lop.find({},function(err,result){
    if(err) throw err;
    if(result){
      lopAll=result;
      sync=false;
    }
  })
  while(sync) {require('deasync').sleep(100);}
  var sync=true;
  console.log(emailGlobal.local);
  for(i=0;i<lopAll.length;++i){
    for(j=0;j<lopAll[i].hoc.length;++j){
      if(lopAll[i].hoc[j].Điệnthoạiliênhệ==emailGlobal.local.email){
        dslop.push(lopAll[i].hoc[j]);
      }
    }
  }
  while(sync) {require('deasync').sleep(100);}
  res.render('xemlich',{
    data:dslop,
    user:emailGlobal,
    message1:req.flash('loginMessage'),
    message2:req.flash('signupMessage'),
    login:login
  });

});

router.post('/goiYLich',isLoggedIn, function(req, res, next) {
  console.log("req goiYLich",req.body);
  var sync1=true,sync2=true,lopTrong,gvTrong;
  sotiet=req.body.sotc*45;
  days6=(sotiet/6)*7;//so ngay ma neu hoc 1 buoi 6 tiet phai hoc cho mon do
  days4=(sotiet/4)*7;//so ngay ma neu hoc 1 buoi 4 tiet phai hoc cho mon do
  daysnCaNgay=(sotiet/16)*7;//so ngay ma neu hoc ca ngay phai hoc cho mon do

  var goiY={};
  // tim thoi gian trong cua lop
  lop.findOne({'tenlop':req.body.khoa},function(err,result){
    if(err) throw err;
    if(result){
      lopTrong={
        thoiGianTrongt7:result.thoiGianTrongt7,
        thoiGianTrongCn:result.thoiGianTrongCn
      };
      sync1=false;
    }
  });
  // tim thoi gian trong cua giao vien
  user.findOne({'local.email':req.body.sdt},function(err,result){
    if(err) throw err;
    if(result){
      gvTrong={
        thoiGianTrongt7:result.thoiGianTrongt7,
        thoiGianTrongCn:result.thoiGianTrongCn
      };
      sync2=false;
    }
  });

  while(sync1||sync2) {require('deasync').sleep(100);}

  //xet buoi sang t7
  sangt7=[];
  //lay tat ca cac thoi gian trong buoi sang thu bay(ca cua lop va giao vien neu khoang
  // thoi gian d o du cho mon hoc do thi day vao mang sangt7 gui lai client cho nguoi dung chon
  for(var i=0;i<gvTrong.thoiGianTrongt7.sang.length;++i){
    var tempGv=moment.range(gvTrong.thoiGianTrongt7.sang[i].batDau,gvTrong.thoiGianTrongt7.sang[i].ketThuc);
    for(var j=0;j<lopTrong.thoiGianTrongt7.sang.length;++j){
      var tempLop=moment.range(lopTrong.thoiGianTrongt7.sang[j].batDau,lopTrong.thoiGianTrongt7.sang[j].ketThuc);
      var tempGiao=tempGv.intersect(tempLop);// thoi gian trong cua ca giao vien va lop
      if(moment(tempGiao.start,"DD-MM-YYYY").add(days6,'days').isSameOrBefore(tempGiao.end)){
        sangt7.push(tempGiao);
        //phan tu chan la gia tri co the cua lop do gia tri phan tu le la gia tri goi y hien tai
        tempGiao=moment.range(tempGiao.start,moment(tempGiao.start,"DD-MM-YYYY").add(days6,'days'));
        sangt7.push(tempGiao);
      }
    }
  }

  //tuong tu buoi sang ta xet voi buoi chieu
  chieut7=[];
  for(var i=0;i<gvTrong.thoiGianTrongt7.toi.length;++i){
    var tempGv=moment.range(gvTrong.thoiGianTrongt7.toi[i].batDau,gvTrong.thoiGianTrongt7.toi[i].ketThuc);
    for(var j=0;j<lopTrong.thoiGianTrongt7.toi.length;++j){
      var tempLop=moment.range(lopTrong.thoiGianTrongt7.toi[j].batDau,lopTrong.thoiGianTrongt7.toi[j].ketThuc);
      var tempGiao=tempGv.intersect(tempLop);// thoi gian trong cua ca giao vien va lop
      if(moment(tempGiao.start,"DD-MM-YYYY").add(days6,'days').isSameOrBefore(tempGiao.end)){
        chieut7.push(tempGiao);
        //phan tu chan la gia tri co the cua lop do gia tri phan tu le la gia tri goi y hien tai
        tempGiao=moment.range(tempGiao.start,moment(tempGiao.start,"DD-MM-YYYY").add(days6,'days'));

        chieut7.push(tempGiao);
      }
    }
  }

  //tuong tu voi toi t7
  toit7=[];
  for(var i=0;i<gvTrong.thoiGianTrongt7.toi.length;++i){
    var tempGv=moment.range(gvTrong.thoiGianTrongt7.toi[i].batDau,gvTrong.thoiGianTrongt7.toi[i].ketThuc);
    for(var j=0;j<lopTrong.thoiGianTrongt7.toi.length;++j){
      var tempLop=moment.range(lopTrong.thoiGianTrongt7.toi[j].batDau,lopTrong.thoiGianTrongt7.toi[j].ketThuc);
      var tempGiao=tempGv.intersect(tempLop);// thoi gian trong cua ca giao vien va lop
      if(moment(tempGiao.start,"DD-MM-YYYY").add(days6,'days').isSameOrBefore(tempGiao.end)){
        toit7.push(tempGiao);
        //phan tu chan la gia tri co the cua lop do gia tri phan tu le la gia tri goi y hien tai
        tempGiao=moment.range(tempGiao.start,moment(tempGiao.start,"DD-MM-YYYY").add(days6,'days'));

        toit7.push(tempGiao);
      }
    }
  }
  goiY={
    'sotc':req.body.sotc,
    'sangt7':sangt7,
    'chieut7':chieut7,
    'toit7':toit7,
  }
  // console.log(goiY);
  res.json(goiY);

});

router.post('/submitLich',isLoggedIn,function(req,res,next){

  var sync1=sync2=true;
  lop.findOne({'tenlop':req.body.khoa},function(err,result){
    if(err) throw err;
    if(result){
      lopTrong={
        thoiGianTrongt7:result.thoiGianTrongt7,
        thoiGianTrongCn:result.thoiGianTrongCn
      };
      sync1=false;
    }
  });
  // tim thoi gian trong cua giao vien
  user.findOne({'local.email':req.body.sdt},function(err,result){
    if(err) throw err;
    if(result){
      gvTrong={
        thoiGianTrongt7:result.thoiGianTrongt7,
        thoiGianTrongCn:result.thoiGianTrongCn
      };
      sync2=false;
    }
  });
  while(sync1||sync2) {require('deasync').sleep(100);}
  if(req.body.buoi=='"sangt7"'){
    var range1=moment.range(moment(req.body.batDau, 'YYYY-MM-DD'),moment(req.body.ketThuc,'YYYY-MM-DD'));
    for(i=0;i<lopTrong.thoiGianTrongt7.sang.length;++i){
      var range2=moment.range(moment(lopTrong.thoiGianTrongt7.sang[i].batDau, 'YYYY-MM-DD'),moment(lopTrong.thoiGianTrongt7.sang[i].ketThuc, 'YYYY-MM-DD'));
      if(range1.intersect(range2)!=null){
        var temp={
          batDau:req.body.ketThuc,
          ketThuc:lopTrong.thoiGianTrongt7.sang[i].ketThuc,
        };
        lopTrong.thoiGianTrongt7.sang[i].ketThuc=req.body.batDau;
        lopTrong.thoiGianTrongt7.sang.push(temp);
        lop.update(
          {tenlop:req.body.khoa},
          {thoiGianTrongt7:{
            sang:lopTrong.thoiGianTrongt7.sang
            }
          },
          function(err,result){
            if(err) throw err;
            if(result){
              console.log("Cap nhat thoi gian trong thanh cong cho lop",req.body.khoa);
            }
          }
        )
      };

    }
  }

  console.log('batDau',req.body.batDau);
  console.log('ketThuc',req.body.ketThuc);
  res.json({});
})

router.post('/nhapthoigian',isLoggedIn,function(req,res,next){
  var sync=true;
  var batDau=new Date(req.body.batDauHocKy);
  var ketThuc=new Date(req.body.ketThucHocKy);

    user.update(
      {},
      {
        batDauHocKy:batDau,
        ketThucHocKy:ketThuc,
        thoiGianTrongt7:{
          sang:{
            batDau:batDau,
            ketThuc:ketThuc
          },
          chieu:{
            batDau:batDau,
            ketThuc:ketThuc
          },
          toi:{
            batDau:batDau,
            ketThuc:ketThuc
          }
        },
        thoiGianTrongCn:{
          sang:{
            batDau:batDau,
            ketThuc:ketThuc
          },
          chieu:{
            batDau:batDau,
            ketThuc:ketThuc
          },
          toi:{
            batDau:batDau,
            ketThuc:ketThuc
          }
        }
      },
      {multi:true},
      function(err,result){
        if(err) throw err;
        if(result){
          console.log("Cap nhat thoi gian hoc ky thanh cong cho user");
        }
      }
    );

    lop.update(
      {},
      {
        batDauHocKy:batDau,
        ketThucHocKy:ketThuc,
        thoiGianTrongt7:{
          sang:{
            batDau:batDau,
            ketThuc:ketThuc
          },
          chieu:{
            batDau:batDau,
            ketThuc:ketThuc
          },
          toi:{
            batDau:batDau,
            ketThuc:ketThuc
          }
        },
        thoiGianTrongCn:{
          sang:{
            batDau:batDau,
            ketThuc:ketThuc
          },
          chieu:{
            batDau:batDau,
            ketThuc:ketThuc
          },
          toi:{
            batDau:batDau,
            ketThuc:ketThuc
          }
        }
      },
      {multi:true},
      function(err,result){
        if(err) throw err;
        if(result){
          console.log("Cap nhat thoi gian hoc ky thanh cong cho lop ");
        }
      }
  );

  lop.find({},function(err,result){
    if(err) throw err;
    if(result){
      data=result;
      res.render('nhapdulieu',{
        data:data,
        user:emailGlobal,
        message1:req.flash('loginMessage'),
        message2:req.flash('signupMessage'),
        login:login
      });
    }
  })
});

router.get('/dangkylich',isLoggedIn, function(req, res, next) {
  var lopAll,dslop=[];
  var sync=true;
  lop.find({},function(err,result){
    if(err) throw err;
    if(result){
      lopAll=result;
      sync=false;
    }
  })
  while(sync) {require('deasync').sleep(100);}
  var sync=true;
  for(i=0;i<lopAll.length;++i){
    for(j=0;j<lopAll[i].hoc.length;++j){
      if(lopAll[i].hoc[j].Điệnthoạiliênhệ==emailGlobal.local.email){
        dslop.push(lopAll[i].hoc[j]);
      }
    }
    sync=false;
  }
  while(sync) {require('deasync').sleep(100);}
  res.render('dangkylich',{
    data:dslop,
    user:emailGlobal,
    message1:req.flash('loginMessage'),
    message2:req.flash('signupMessage'),
    login:login
  });
  lop.find({'email':emailGlobal.local.email},function(err,result){
    if(err) throw err;
    if(result){
      var temp=result;

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
