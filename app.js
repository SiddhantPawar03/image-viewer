const express = require('express');
const app = express();
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo');
const secret = process.env.SECRET_KEY || "EDI@50";
const dbUrl = 'mongodb://localhost:27017/dobbyDB'
const userDetails = require('./models/userDetails');
const imageDetails = require('./models/imageDetails');
const cors = require('cors');
const ejs = require('ejs');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

app.use(express.json());
app.use(cors());
app.use(express.static("public"));

const store = MongoStore.create({
    mongoUrl: dbUrl,
    secret,
    touchAfter: 24 * 60 * 60
  })
  store.on('error', e => {
    console.log('Session Error!!!', e)
  });


  mongoose.connect(dbUrl, { useNewUrlParser: true })
  .then(data => console.log("Database connected"))
  .catch(err => console.log("Database connection failed"));


app.get('/', function(req,res){
    res.send("Hello, world!");
});

// app.get('/register', function(req,res){
//     res.render('register');
// });

const User = mongoose.model("userSchema",userDetails.userSchema);
app.post('/register', async(req,res)=>{
    const {fname,lname,email,password} = req.body;

    const encryptedPassword = await bcrypt.hash(password,10);
    try{
        const oldUser = await User.findOne({email});
        if(oldUser) {
            return res.send({error: 'User already exists'});
        }
        await User.create({fname,lname,email,password:encryptedPassword});
        res.send({status: "ok"});
    }
    catch(err){
        console.log(err);
    }
});

app.post('/login', async (req, res) => {
    const {email,password} = req.body;

    const user = await User.findOne({email});
    if(!user){
        return res.json({error: "User not found"});
    }
    if(await bcrypt.compare(password,user.password)){
        const token = jwt.sign({email:user.email}, secret);
        if(res.status(201)){
            return res.json({status: "ok", data: token});
        }
        else{
            return res.json({error: "error"});
        }
    }
 res.json({status:"error",error:"Invalid password"});
});

// var res;
app.post('/userData', async(req,res) => {
    const {token} = req.body;
    try{
        const user = jwt.verify(token, secret, (err,res) => {
            if(err) {
                return "Token Expired";
            }
            return res;
        });
        if(user == "Token Expired"){
            return res.send({status:"error", data: "Token Expired"});
        }
        const usermail = user.email;
        // var res = usermail;
        // console.log(res);
        User.findOne({email: usermail}).then((data)=>{
            res.send({status:"ok", data: data});
        })
        .catch((err)=>{
            res.send({status:"error"});
        });
    }
    catch(err){

    }
});

const Image = mongoose.model("imageSchema",imageDetails.imageSchema);
app.post('/upload-image', async(req,res)=>{
    const {token} = req.body;
    
   
    const {base64} = req.body;
    try{
        const user = jwt.verify(token, secret, (err,res) => {
            if(err) {
                return "Token Expired";
            }
            return res;
        });
        const usermail = user.email;
        await Image.create({image:base64,email:usermail});
        res.send({status:"ok"});
    }
    catch(err){
        res.send({status:"error" + err});
    }
});

app.get('/get-image',async(req,res) => {
    const {email} = req.body;
    try{
        // const user = jwt.verify(token, secret, (err,res) => {
        //     if(err) {
        //         return "Token Expired";
        //     }
        //     return res;
        // });
        // const usermail = user.email;
       await Image.find({email}).then(data => {
        res.send({status:"ok", data:data})
       }) 
    }
    catch(err){

    }
});

app.listen(3001, function(){
    console.log('Listening on Port 3001!');
})