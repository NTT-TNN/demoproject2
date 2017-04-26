var mongoose=require('mongoose');

var lopSchema=mongoose.Schema({
  tenlop:String,
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
    thoiGianBatDau:Date,
    thoiGianKetThuc:Date,
    ghiChu:String
  }]
});

module.exports = mongoose.model('lop',lopSchema);
