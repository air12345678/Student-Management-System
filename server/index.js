var express = require('express');
var cors = require('cors');
var bodyparser = require('body-parser');
var app = express();
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;
var nodemailer = require('nodemailer');
app.use(cors());

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
app.post('/sign-up',bodyparser.json(),(req,res)=>{
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
   
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'kkgupta221997@gmail.com',
          pass: 'air@1234'
        }
      });
      
      var mailOptions = {
        from: 'kkgupta221997@gmail.com',
        to: user.email,
        subject: 'Welcome',
        text: 'Thankyou for visiting us website'
      };
      
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
})
app.post('/create-student',bodyparser.json(),(req,res)=>{
  console.log(req.body);
  var collection =connection.db('smsdb').collection('students');
   collection.insert(req.body,(err,r)=>{
   if(!err){
      res.send({status:"Ok"});
   }
   else{
      res.send({status:"failed"});
     }
   })
 
})
app.get('/getstudents',bodyparser.json(), (req,res)=>{
  var collection =connection.db('smsdb').collection('students');
  
  console.log(req.body);
  
  collection.find().toArray((err,docs)=>{
      if(!err && docs.length > 0){
          console.log(docs)
          res.send({status:"Ok",resultData:docs})
      }
      else{
          res.send({status:"failed",resultData:err})
      }
     
  })
})
app.post('/studentdetail',bodyparser.json(), (req,res)=>{
  var collection =connection.db('smsdb').collection('students');
  var query = {email:req.body.email}
  console.log(req.body);
  collection.find(query).toArray((err,docs)=>{
      if(!err && docs.length > 0){
          console.log(docs)
          res.send({status:"Ok",resultData:docs})
      }
      else{
          res.send({status:"failed",resultData:err})
      }
     
  })
})
app.post('/delete-student',bodyparser.json(), (req,res)=>{
  console.log(req.body);
  var collection =connection.db('smsdb').collection('students');
collection.remove({_id:ObjectId(req.body._id)},(err,r)=>{
  if(!err){
      res.send({status:"Ok"});
  }
  else{
      res.send({status:"failed"});
  }
})
})
app.put('/update-student',bodyparser.json(), (req,res)=>{
  console.log(req.body);
  var collection =connection.db('smsdb').collection('students');
collection.update({_id:ObjectId(req.body._id)},
     {$set:{name:req.body.name,fathername:req.body.fathername,email:req.body.email,
      contactno:req.body.contactno,gender:req.body.gender,branch:req.body.branch,
      course:req.body.course, teachername:req.body.teachername
      ,dateofbirth:req.body.dateofbirth,address:req.body.address}},(err,r)=>{
  if(!err){
      res.send({status:"Ok"});
      console.log("1 document updated");
  }
  else{
      res.send({status:"failed"});
  }
})
})

app.post('/create-teacher',bodyparser.json(),(req,res)=>{
  console.log(req.body);
  var collection =connection.db('smsdb').collection('teachers');
   collection.insert(req.body,(err,r)=>{
   if(!err){
      res.send({status:"Ok"});
   }
   else{
      res.send({status:"failed"});
     }
   })
 
})
app.get('/getteachers',bodyparser.json(), (req,res)=>{
  var collection =connection.db('smsdb').collection('teachers');
  
  console.log(req.body);
  
  collection.find().toArray((err,docs)=>{
      if(!err && docs.length > 0){
          console.log(docs)
          res.send({status:"Ok",resultData:docs})
      }
      else{
          res.send({status:"failed",resultData:err})
      }
     
  })
})
app.post('/teacherdetail',bodyparser.json(), (req,res)=>{
  var collection =connection.db('smsdb').collection('teachers');
  var query = {email:req.body.email}
  console.log(req.body);
  console.log(query);
  collection.find(query).toArray((err,docs)=>{
      if(!err && docs.length > 0){
          console.log(docs)
          res.send({status:"Ok",resultData:docs})
      }
      else{
          res.send({status:"failed",resultData:err})
      }
     
  })
})
app.post('/delete-teacher',bodyparser.json(), (req,res)=>{
  console.log(req.body);
  var collection =connection.db('smsdb').collection('teachers');
collection.remove({_id:ObjectId(req.body._id)},(err,r)=>{
  if(!err){
      res.send({status:"Ok"});
  }
  else{
      res.send({status:"failed"});
  }
})
})
app.put('/update-teacher',bodyparser.json(), (req,res)=>{
  console.log(req.body);
  var collection =connection.db('smsdb').collection('teachers');
collection.update({_id:ObjectId(req.body._id)},
     {$set:{name:req.body.name,email:req.body.email,
      contactno:req.body.contactno,gender:req.body.gender,
      course:req.body.course
      ,dateofbirth:req.body.dateofbirth,address:req.body.address}},(err,r)=>{
  if(!err){
      res.send({status:"Ok"});
      console.log("1 document updated");
  }
  else{
      res.send({status:"failed"});
  }
})
})
app.post('/addcourse',bodyparser.json(),(req,res)=>{
  console.log(req.body);
  var collection =connection.db('smsdb').collection('courses');
  collection.insert(req.body,(err,r)=>{
    if(!err){
       res.send({status:"Ok"});
    }
    else{
       res.send({status:"failed"});
      }
    })
})
app.get('/getcourse',bodyparser.json(),(req,res)=>{
  console.log(req.body)
  var collection =connection.db('smsdb').collection('courses');
  collection.find().toArray((err,docs)=>{
    if(!err && docs.length > 0){
        console.log(docs)
        res.send({status:"Ok",resultData:docs})
    }
    else{
        res.send({status:"failed",resultData:err})
    }
   
})
})

app.post('/deletecourse',bodyparser.json(), (req,res)=>{
  console.log(req.body);
  var collection =connection.db('smsdb').collection('courses');
collection.remove({_id:ObjectId(req.body._id)},(err,r)=>{
  if(!err){
      res.send({status:"Ok"});
  }
  else{
      res.send({status:"failed"});
  }
})
})
app.post('/contactus', bodyparser.json(),(req,res) => {
    var collection = connection.db("smsdb").collection("users");
    console.log("contacted");
    console.log(req.body);
    collection.insert(req.body , (err , docs ) => {
        if(!err)
        {
          console.log(res.send({msg: "Contact Successful" , status:"Ok" ,desc:"All ok"}));
        }
        else
        {
            console.log(res.send({msg: "Contact Failed" , status:"not ok" ,desc:"Try Again"}));
        }
    });
})
app.listen(3000,()=>{console.log("serve is listning on port 3000")});