var mongoose=require('mongoose');

var lopSchema=mongoose.Schema({
  tenlop:String,
  batDauHocKy:String,
  ketThucHocKy:String,
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
