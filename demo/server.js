var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var submitNum;
// var http = require('http');

var app = express();

app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

//数据库连接
mongoose.Promise = global.Promise;

var db = mongoose.connection;

db.on('error', function (error) {
  console.log("mongoose error",error);
});

db.on('open', function () {
  console.log("mongoose connect ok!");
});
mongoose.connect("mongodb://127.0.0.1/stus", {useMongoClient: true});

var Schema = mongoose.Schema;
var admSchema = new Schema({
  name:String,
  passwd:Number
});
var stuSchema = new Schema({
  name:String,
  age:Number,
  gender:Number,
  num:Number
});

var admin = mongoose.model("One",admSchema,"admin");
var student = mongoose.model("Two",stuSchema,"student");
// *******************************************



var options = {
  root:__dirname + "/public"
};

//获得login html页面
app.get("/login",function(req,res){
  res.type("text/html");
  res.status(200);
  res.sendFile("/login.html",options,function(err){
    if(!err){
      console.log("send login.html ok");
    }else {
      console.log(err);
      res.status(404).end();
    }
  });
});

//获取login 密码 用户名
app.post("/login",function(req,res){
  var user = req.body.name;
  var passwd = req.body.passwd;
  admin.find({username: user, passwd: passwd},function(err,docs){
    if(!err){
      res.status(200);
      res.json({status:1});
    }else {
      res.status(500);
      res.json({status:0});
    }
  });

  // var query = admin.find({name:user,passwd:passwd});
  // if (query) {
  //   // res.status(200);
  //   res.json({status:1});
  // }else {
  //   // res.status(500);
  //   res.json({status:0});
  // }
});

//获取register登录页面
app.get("/register",function(req,res){
  res.type("text/html");
  res.status(200);
  res.sendFile("/register.html",options,function(err){
    if(!err){
      console.log("send register.html ok");
    }else {
      console.log("register error",err);
      res.status(404).end();
    }
  });
});


//获取register页面注册信息
app.post("/register",function(req,res){
  var name = req.body.name;
  var passwd = req.body.passwd;

  admin({name: name, passwd: passwd}).save(function(err,data){
    if(!err){
      console.log("注册成功");
      res.status(200);
      res.json({status:1});
    }else {
      res.status(500);
      res.json({status:0});
      console.log("注册失败",err);
    }
  });
});

//获取admin操作页面
app.get("/admin",function(req,res){
  res.type("text/html");
  res.status(200);
  res.sendFile("/admin.html",options,function(err){
    if(!err){
      console.log("send admin.html ok");
    }else {
      console.log(err);
      res.status(404).end();
    }
  });
});

//添加操作
app.post("/admin/add",function(req,res){
  var num = req.body.num;
  var name = req.body.name;
  var age = req.body.age;
  var gender = req.body.gender;
  student.find({num: num},function(err,docs){
    if(!err && docs.length == 0){
      student({name: name, age: age, gender: gender, num: num}).save(function(err,data){
        if(!err){
          console.log(data);
          res.status(200);
          res.json({status:1});
        }else {
          res.status(500);
          res.json({status:0});
          console.log("添加数据错误",err);
        }
      });
    }else {
      res.status(404);
      res.json({status:0});
    }
  });

});

//删除操作
app.post("/admin/delete",function(req,res){
  var num = req.body.num;
  // console.log(parseInt(num));
  student.remove({num: parseInt(num)},function(err,obj){
    if(!err){
      res.status(200);
      res.json({status:1});
    }else {
      res.status(505);
      res.json({status:0});
      console.log("删除失败",err);
    }
  });
});


//查找操作
app.post("/admin/find",function(req,res){
  var num = req.body.num;
  // console.log(parseInt(num));
  student.find({num: parseInt(num)},function(err,docs){
    if(!err){
      // console.log('length',docs.length);
      res.status(200);
      res.json({status:1});
      res.send(docs);
    }else {
      res.status(404);
      res.json({status:0});
      console.log(err);
    }
  });
  // var query = student.find({num:num});
  // console.log(query);
});

//更新操作-提交
app.post("/admin/update",function(req,res){
  submitNum = req.body.num;
  // console.log(submitNum);
});

//更新数据
app.get("/admin/update",function(req,res){

  var name = req.query.name;
  var age = req.query.age;
  var gender = req.query.gender;
  // console.log(req.query);
  // console.log(age);
  console.log(submitNum);

  var update = {$set: {name: name, age: age, gender: gender}};
  student.update({num: parseInt(submitNum)}, update, function(err,docs){
    if(!err){
      console.log("更新成功",docs);
    }else {
      console.log(err);
    }

  });
});
app.listen(8000,function(){
  console.log("监听 8000 ...");
});
