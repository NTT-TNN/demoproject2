var mongoose=require('mongoose');

var gianvienSchema=mongoose.Schema({
  tenGv:String,
  email:String,
  dienThoai:String,
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
    thoiGianBatDau:Date,
    thoiGianKetThuc:Date,
    ghiChu:String
  }]
});

module.exports = mongoose.model('gianvien',gianvienSchema);
