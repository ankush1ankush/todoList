import express from "express";
import bodyParser from "body-parser";

const app=express();

app.use(bodyParser.urlencoded({extended:true}))

app.use(express.static("public"));
var TodayList=["hello","hi","by"];
app.get("/",function(req,res){
        res.locals={
            check:true,
        }
        res.render("index.ejs",{
            todayList:TodayList
        });
 });
app.listen(3000,function(req,res){
    console.log("server has started on the porn number 3000");
}
)