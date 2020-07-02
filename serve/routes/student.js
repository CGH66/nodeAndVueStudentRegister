var express = require('express');
var router = express.Router();
const query=require('../db/db.js')
const common=require('../lib/common.js')
router.get('/Upd/:stu_class/:Room_name/:Room_number/:stu_id', function(req, res, next) {
  let stu_id=req.params.stu_id
  let stu_class=req.params.stu_class
  let Room_name=req.params.Room_name
  let Room_number=req.params.Room_number
  let sql="update stu_college set stu_class='"+stu_class+"' where stu_id='"+stu_id+"'";
  let sql2="update stu_room set Room_name='"+Room_name+"',Room_number='"+Room_number+"' where stu_id='"+stu_id+"'";
  query(sql,function (err,resa) {
    if(err){
      console.log(err)
    }
    query(sql2,function (err,resd) {
      if(err){
        console.log(err)
      }
      res.send({msg:"success"})
    })
  })

});
router.get('/modal/:stu_id', function(req, res, next) {
  let stu_id=req.params.stu_id
  let sql="select * FROM stu_college c,stu_room r where c.stu_id=r.stu_id and c.stu_id='"+stu_id+"'"
  query(sql,function (err,results) {
    if(err){console.log(err)}
    res.json(results)
  })
});
router.get('/totalCount', function(req, res, next) {
  let sql="select count(*) as totalCount from stu_college"
  query(sql,function (err,result) {
    if(err){console.log(err)}
    res.json(result)
  })
})
router.get('/content/:pageIndex/:pageSize', function(req, res, next) {
  let pageIndex=parseInt(req.params.pageIndex)
  let pageSize=parseInt(req.params.pageSize)

  let pos=(pageIndex-1)*pageSize
  let sql="select * FROM stu_college c,stu_room r where c.stu_id=r.stu_id order by c.id limit "+pos+" , "+pageSize+"";
  query(sql,function (err,results) {
    if(err){console.log(err)}
    res.json(results)
  })
})
module.exports = router;
