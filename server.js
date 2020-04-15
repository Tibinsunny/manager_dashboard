//Required Modules
const express=require('express')
const app=express()
const mongoose=require('mongoose')
var session = require('express-session')
const connector=require('./model/reg')
//Middle Ware
app.use(express.urlencoded({extended:false}))

//Session MiddleWare
app.use(session({
    secret: 'keyboard cat', 
    cookie: { maxAge: 6000000 },
    resave: false,
    saveUninitialized: false
  }));
  

//Databse Connection Establisher
mongoose.connect("mongodb://127.0.0.1/user_login",{useNewUrlParser: true ,  useUnifiedTopology: true})
//Set View Engine
app.set('view engine','ejs')

//Server 

app.listen(3000)



//route to get Index
app.get('/',function(req,res)
{
    res.render('index')
})

//Route to ge Signup

app.get('/signup',function(req,res)
{
    res.render('register',{msg:" "})
})

//Post Methods for Signup

app.post('/signup',async(req,res)=>
{
    var name=req.body.name
    var password=req.body.password;
    var email=req.body.email;
    var department=req.body.department
    var query={"email":email}
    const check_data=await connector.findOne(query)
    console.log(check_data)
    if(check_data==null)
    {

    const test=await connector.create({
        name:name,
        password:password,
        email:email,
        department:department
    },function(err)
    {
        if(!err)
        {
           res.redirect('/')
        }
        else{
            res.redirect('/signup')
        }
    })
    }
    else
    {
        res.render('register',{msg:"Email Exists"})
    }
})

//Post method for Auth
app.post('/',async(req,res)=>
{
    var name=req.body.name
    var password=req.body.password
   
    const auth=await connector.findOne({name:name,password:password})
    req.session.uid=auth._id
    if(auth!=null)
    {
       
       res.redirect('/dashboard')
       
    }
    else
    {
        res.redirect('/asdasd')
    }
})

//dashboard

app.get('/dashboard',async(req,res) =>
{
    req.session.uid=auth.id
    if(req.session.uid)
    {
      
const auth=await connector.findOne({_id:req.session.uid})

    res.render('dashboard',{auth:auth})
}
    else
    {
        res.redirect('/')
    }
})

app.get('/logout',function(req,res)
{
 req.session.destroy()
 res.redirect('/')
})





