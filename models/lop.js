var mongoose=require('mongoose');

var lopSchema=mongoose.Schema({
  tenlop:String,
  batDauHocKy:String,
  ketThucHocKy:String,
  thoiGianTrongt7:{
    sang:{
      batDau:String,
      ketThuc:String,
    },
    chieu:{
      batDau:String,
      ketThuc:String,
    },
    toi:{
      batDau:String,
      ketThuc:String,
    },
  },
  thoiGianTrongCn:{
    sang:{
      batDau:String,
      ketThuc:String,
    },
    chieu:{
      batDau:String,
      ketThuc:String,
    },
    toi:{
      batDau:String,
      ketThuc:String,
    },
  },
  thoiGianFull:{
    sang:{
      batDau:String,
      ketThuc:String,
    },
    chieu:{
      batDau:String,
      ketThuc:String,
    },
    toi:{
      batDau:String,
      ketThuc:String,
    },
  },
  // malop:String,
  hoc:[{
    tenlop:String,
    Mãhọcphần:String,
    Tênlớphọcphần:String,
    Sốlượng:Number,
    maHP:String,
    SốTC:Number,
    Phònghọc:String,
    Giảngviên:String,
    email:String,
    Cơquancôngtác:String,
    Điệnthoạiliênhệ:String,
    thu:String, //thứ
    tiet:String,
    thoiGianBatDau:String,
    thoiGianKetThuc:String,
    ghiChu:String
  }]
});

module.exports = mongoose.model('lop',lopSchema);
