import 'dotenv/config';
import express from "express";

import bodyParser from "body-parser";
import mongoose from "mongoose";
import _ from "lodash";

const app=express();
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));


main().catch(err => console.log(err));



async function main()
{
  


const PORT=process.env.PORT||3000;
   


const connectDB= async ()=>{ 

try{
    const conn= await mongoose.connect(process.env.MONGO_URI);// making data base
    console.log(`MongoDB Connected:${conn}`);
 }
 catch(error)
 {
  console.log(error);
  process.exit(1);
 }

}
const newItem= new mongoose.Schema({ //schema for the data base
 name:String,
})


var TodayList=mongoose.model("todayTask",newItem); // making todayTask collection


const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const weekday = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
// default items
var today_item1=new TodayList({   // creating the document for the collection todayTasks base on newItem
  name:"watch netflix"
});
var today_item2=new TodayList({
  name:"play football"
});
var today_item3=new TodayList({
  name:"take bath"
});


const listSchema={
  name:String,
  items:[newItem]

};

const List=mongoose.model("List",listSchema);


const defaultItems=[today_item1,today_item2,today_item3];


app.get("/",async function(req,res){
        const d = new Date();
        res.locals={
            check:true,
        }
        var ans=await TodayList.find({});
        if(ans.length===0)
        {
          await TodayList.insertMany([today_item1,today_item2,today_item3]);
          res.redirect("/");
        
        }else{
            res.render("index.ejs",{
            todayList:ans,
            day:weekday[d.getDay()],
            date:d.getDate(),
            month:months[d.getMonth()]
        });
      }
 });
/*
 app.get("/work",async function(req,res){
 
   var ans=await workList.find({});
   if(ans.length===0)
   {
    await workList.insertMany([work_item1,work_item2,work_item3])
    res.redirect("/work");
   }else{
   res.render("index.ejs",{todayList:ans});
  }
 });
*/
app.get("/:PramsName",async function(req,res)
{
    const CustomList= _.capitalize(req.params.PramsName);
    var list=await List.findOne({name:CustomList});
    if(list==null||list.length==0)
    { 
      //creating the new list
      list=new List({name:CustomList,items:defaultItems});
      await List.insertMany([list]);
      console.log("list Not found");
      res.redirect(`/${CustomList}`);
    }
    else{
      // for exsisting  List
      console.log("list exist");
      res.render("index.ejs",{todayList:list.items,listTitle:CustomList})
    }
   
  
});

  
 app.post("/", async function(req,res){

    var listName=req.body.listName;
    console.log(listName);
    if(listName==="todayList")
    {
    const item=new TodayList({
     name:req.body.newItem,
     });
   
     TodayList.insertMany([item]);
      res.redirect("/");
    }
    else{
       var list=await List.findOne({name:listName});
       var item=new TodayList({
        name:req.body.newItem
       })
       await list.items.push(item);
       await list.save();
       res.redirect(`/${listName}`);
    }
 });

 
  app.post("/delete",async function(req,res){
      
      var listName=req.body.listName;
      if(listName==="todayList"){
      await TodayList.deleteOne({_id:req.body.checkbox});
      res.redirect("/");
      }else{
        await List.findOneAndUpdate({name:listName},{$pull:{items:{_id:req.body.checkbox}}});// for removing from array;
        res.redirect(`/${listName}`);
      }
  });
 

connectDB().then(function(){
  app.listen(PORT,function(req,res){console.log("server has started on the port number 3000");});
          });

}