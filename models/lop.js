var mongoose=require('mongoose');

var lopSchema=mongoose.Schema({
  tenlop:String,
  malop:String,
  hoc:[{
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

module.exports = mongoose.model('lop',lopSchema);
