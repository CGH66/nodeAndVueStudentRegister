var express = require('express');
var router = express.Router();
const query=require('../db/db.js')
const common=require('../lib/common.js')
/* GET users listing. */
//异步编程 0 获取 1数据库获取专业人数 2生成班级 学号 3分配宿舍 4 插入学生注册表 5插入宿舍表

const quer=function(value){

  return new Promise(function (resolve) {
    let sql="select * from stu_room where Room_number='"+value+"'";
    query(sql,function (err,ress) {
      if(err){
        console.log(err)
      }
      resolve(ress.length)
    })
  })
}
const inser=function (stu_id,value,b,res) {
  new Promise(function (resolve) {
    let sql="Insert into stu_Room (stu_id,Room_number) values('"+stu_id+"','"+value+"')";
    query(sql,function (err,rs) {
      if(err){
        console.log(err)
      }
      resolve(rs)
      res.send({flag:true,msg:'注册成功 宿舍:'+value+",学号:"+b})
    })
  })
}
const room=async function(stu_id,b,res){
var stu_id=stu_id
  for ( i = 1; i > -1; i++)
  {

    if (i < 10) {
      value = "00" + i;
    } else if ((i >= 10) && (i < 100)) {
      value = "0" + i;
    }
    let l=await quer(value)
    if(l<4){
      console.log("fs")
     let rs=await inser(stu_id,value,b,res)
      console.log(rs)
      break
    }
  }
}
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
//登录验证
router.post('/login', function(req, res, next) {
  let {username,password}=req.body;
  let sql="select * from admin where name='"+username+"'";

 query(sql,function (err,result) {
    if(err){
      console.log(err)
    }else{
      if(result.length==0){
        res.send({flag:false,msg:'账号不存在'})
      }else if(result[0].password!=common.md5(password)){
        res.send({flag:false,msg:'密码错误'})
      }else {
        res.send({flag:true,msg:'登录成功'})
      }
    }
  })
});
router.post('/RegById', function(req, res, next) {
  let {stu_id}=req.body;
  let sql="select * from student_base where stu_id='"+stu_id+"'";
  query(sql,function (err,result) {
    if(err){
      console.log(err)
    }else if(result.length==0){
      res.send({flag:false,msg:'非我校新生'})
    }else{
      res.send({flag:true,msg:result})
    }

  })
})
//根据名字注册
router.post('/RegByname', function(req, res, next) {
  let {username}=req.body;
  let sql="select * from student_base where stu_name='"+username+"'";
  query(sql,function (err,result) {
    if(err){
      console.log(err)
    }else if(result.length==0){
      res.send({flag:false,msg:'非我校新生'})
    }else{
      res.send({flag:true,msg:result})
    }

  })
})
//注册学生插入
//业务逻辑 注册表中查找此人 若有返回已注册
//无 基础表中获取信息 获取注册表中此专业的人数 生成班级 学号
//注册表插入 分配宿舍 插入宿舍表
//代码可读性差 可考虑用 异步编程优化 可读性会好点
router.post('/InsertRegStudent', function(req, res, next) {
  const {stu_id}=req.body;
  console.log("aaa",stu_id)
  let sql="select * from student_base where stu_id='"+stu_id+"'";
  //是否在注册表中
  let sq="select * from stu_college where stu_id='"+stu_id+"'";
  query(sq,function (err,resul) {
    if(err){
      console.log(err)
    }
    //注册表有无此人

    else if(resul.length!=0){
      res.send({flag:false,msg:'已注册'})
    }else{
      //获取基础表中的信息
      query(sql,function (err,result) {
        if (err) {
          console.log(err)
        }
        Personal=result[0].stu_Personal
        let sq="SELECT * FROM stu_college where stu_nowperson='"+Personal+"'";
       //获取专业人数
        query(sq,function (err,resu) {
          if(err){
            console.log(err)
          }else{
            var third=resu.length
            let a = Math.ceil(third / 50)
            if(a==0){
              a=1
            }
            //生成学号 年份两位 专业2位 专业人数
            //       //年份后2位
            var myDate = new Date();
            var year = myDate.getFullYear();
            var first = year.toString().substr(2, 2);
            if (result[0].stu_Personal == "计算机科学与技术") {
              var second = "01"
            } else if (result[0].stu_Personal == "物联网") {
              var second = "02"
            } else {
              var second = "03"
            }
            if (third < 10) {
              third = "00" + third
            } else if ((third > 10) && (third < 100)) {
              third = "0" + third
            }
            //学号
            let b = first + second + third
            //插入注册表
            let sql1 = "Insert into stu_college " +
              "(stu_name,stu_gender,stu_class,stu_nowperson,stu_num,stu_id)" +
              " values('" + result[0].stu_name + "','" + result[0].stu_gender + "'," +
              "'" + a + "','" + result[0].stu_Personal + "'," +
              "'" + b + "','" + result[0].stu_id + "')"
            query(sql1, function (err, results) {
              if (err) {
                console.log(err)
              } else {
                //分配宿舍

                room(stu_id,b,res)


              }
            })

          }
        })
      })
    }
  })

})
module.exports = router;
