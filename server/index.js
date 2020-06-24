var express = require('express');
var cors = require('cors');
var bodyparser = require('body-parser');
var app = express();
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;
var nodemailer = require('nodemailer');
app.use(cors());
var url = "mongodb://localhost:27017/MongoDatabase";  
let client = new MongoClient("mongodb://localhost:27017/smsdb",{useNewurlParser:true});
var connection;
client.connect((err,con)=>{
  if(!err){
      console.log("Database connected Successfully");
      connection = con;
  }
  else{
      console.log("Database chould not be connected");
  }
});

app.get('/',(req,res)=>{
    res.send("Hello From Server");
})


app.post('/signup',bodyparser.json(),(req,res)=>{
    console.log(req.body);
    var collection =connection.db('smsdb').collection('users');
     collection.insert(req.body,(err,r)=>{
     if(!err){
        res.send({status:"Ok"});
     }
     else{
        res.send({status:"failed"});
       }
     })
   
})
app.post('/login',bodyparser.json(), (req,res)=>{
    var collection =connection.db('smsdb').collection('users');
    var query = {email:req.body.email, password:req.body.password}
    console.log(req.body);
    collection.find(query).toArray((err,docs)=>{
        if(!err && docs.length > 0){
            console.log(docs)
            // res.status(200).send({resultData:docs});
            res.send({status:"Ok",resultData:docs})
        }
        else{
            // res.status(401).send('Inavlid Id Or password')
            res.send({status:"failed",resultData:err})
        }
       
    })
})
   
app.post("/email",bodyparser.json(),(req,res)=>{
    console.log("request came");
    console.log(req.body);
    var user =req.body;
    console.log(user);
    let transporter= nodemailer.createTransport
    (
        {
            host:"smtp.gmail.com",
            port:587,
            secure:false,
            auth:
            {
                user:"kkgupta221997@gmail.com",
                pass:"air@1234"
            }
        }
    );
    let mailOptions = {
        from:"kkgupta221997@gmail.com",
        to:user.email,
        subject:'welcome!',
        html:`<h3>Hello ${user.name} </h3>
        <br>
        <h2>${user.message}</h2>
        <br>
        <h1> ThankYou For Visiting Our Website...!!</h1>`
    };
    transporter.sendMail(mailOptions,function(error,info)
    {
        if(error){
            console.log(error);
        }
        else{
            res.send({status:"Ok"});
            console.log('Email sent:' + info.response);
        }
    })
})
        
app.listen(3000,()=>{console.log("serve is listning on port 3000")});