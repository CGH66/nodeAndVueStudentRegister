var express = require('express');
var router = express.Router();
var query=require('../db/db')
const multer=require('multer')
const moment=require('moment')
const fs=require('fs')
let uploadDir=`./public/upload/${moment().format('YYYYMMDD')}/`

const storage=multer.diskStorage({
  destination:function (req,file,cb) {
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, {
        recursive: true
      })
    }
    cb(null,uploadDir)
  },
  filename:function (req,file,cb) {
    cb(null,Date.now()+'-'+file.originalname)
  }
})
let upload=multer({
  storage:storage
}).array('pic')
router.post('/uploadFile', function(req, res, next) {
  upload(req,res,function (err) {
    if(err){
      console.log(err)
      return
    }else{
      let {stu_name,stu_gender,stu_highSchool,stu_id,stu_Personal}=req.body

      let stu_imgPath=req.files[0].path
      let sql="INSERT INTO `student_base` " +
        "(`stu_name`, `stu_gender`, `stu_highSchool`, `stu_id`, `stu_Personal`,`stu_imgPath`) " +
        "VALUES ('"+stu_name+"', '"+stu_gender+"', '"+stu_highSchool+"', '"+stu_id+"','"+stu_Personal+"', '"+stu_imgPath+"')"
      query(sql,function (err,result) {
        if(err){
          console.log(err)
        }
        else {
          res.status(200).json({flag: true, msg: "录取成功"})
        }
      })
    }
  })

});
module.exports = router;
