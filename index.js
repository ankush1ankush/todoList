import express from "express";
import bodyParser from "body-parser";

const app=express();

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const weekday = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

var TodayList=["hello","hi","by"];
var workList=["anj","iuh","","jks"];
app.get("/",function(req,res){
      const d = new Date();

        res.locals={
            check:true,
        }
        res.render("index.ejs",{
            todayList:TodayList,
            day:weekday[d.getDay()],
            date:d.getDate(),
            month:months[d.getMonth()]
        });
 });
 app.get("/work",function(req,res){
  
  res.render("index.ejs",{todayList:workList});
 })
 app.post("/",function(req,res){
   var item=req.body.newItem;
   TodayList.push(item);
   res.render("index.ejs",{
    todayList:TodayList
   })
 });
 app.post("/work",function(req,res){
    var item=req.body.newItem;
    workList.push(item);
    res.render("index.ejs",{
     todayList:workList
    })
  });
app.listen(3000,function(req,res){
    console.log("server has started on the porn number 3000");
}
)