var mongoose=require('mongoose');
var bcrypt=require('bcrypt-nodejs');

var userSchema=mongoose.Schema({
  local:{
    email:String,//số điện thoại
    password:String,
    Tên:String,
    Tuổi:Number,
    Cơquancôngtác:String,
    Điệnthoại:String// không sử dụng
  },
  batDauHocKy:Date,
  ketThucHocKy:Date,
  thoiGianTrongt7:{
    sang:[{
      batDau:Date,
      ketThuc:Date,
    }],
    chieu:[{
      batDau:Date,
      ketThuc:Date,
    }],
    toi:[{
      batDau:Date,
      ketThuc:Date,
    }],
  },
  thoiGianTrongCn:{
    sang:[{
      batDau:Date,
      ketThuc:Date,
    }],
    chieu:[{
      batDau:Date,
      ketThuc:Date,
    }],
    toi:[{
      batDau:Date,
      ketThuc:Date,
    }],
  },
  thoiGianFull:{
    sang:[{
      batDau:Date,
      ketThuc:Date,
    }],
    chieu:[{
      batDau:Date,
      ketThuc:Date,
    }],
    toi:[{
      batDau:Date,
      ketThuc:Date,
    }],
  },
  trongTuan:{
    thu2:[{
      batDau:Date,
      ketThuc:Date,
    }],
    thu3:[{
      batDau:Date,
      ketThuc:Date,
    }],
    thu4:[{
      batDau:Date,
      ketThuc:Date,
    }],
    thu5:[{
      batDau:Date,
      ketThuc:Date,
    }],
    thu6:[{
      batDau:Date,
      ketThuc:Date,
    }],
  },
  type:{
    admin:Boolean
  },
  day:[{
    tenGv:String,
    email:String,
    dienThoai:String,
    tenlop:String,
    malop:String,
    malopHoc:String,
    soLuongSV:Number,
    maHP:String,
    soTinChi:Number,
    khoa:String,
    phong:String,
    thu:String, //thứ
    tiet:String,
    buoi:String,
    thoiGianBatDau:Date,
    thoiGianKetThuc:Date,
    ghiChu:String
  }]
});

userSchema.methods.generateHash=function(password){
  return bcrypt.hashSync(password,bcrypt.genSaltSync(8),null);
}

userSchema.methods.validPassword=function(password){
  return bcrypt.compareSync(password,this.local.password);
}

module.exports = mongoose.model('User',userSchema);
