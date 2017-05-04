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
  type:{
    admin:Boolean
  }
});

userSchema.methods.generateHash=function(password){
  return bcrypt.hashSync(password,bcrypt.genSaltSync(8),null);
}

userSchema.methods.validPassword=function(password){
  return bcrypt.compareSync(password,this.local.password);
}

module.exports = mongoose.model('User',userSchema);
