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
    cookie: { maxAge: 60000000 },
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


    if(auth!=null)
    {
        req.session.uid=auth.id
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
   
    if(req.session.uid)
    {
      
const auth=await connector.findOne({_id:req.session.uid})
console.log(auth)
    res.render('dashboard',{auth:auth})
}
    else
    {
        res.redirect('/')
 }
})



app.get('/settings',async(req,res) =>
{
    if(req.session.uid)
    {
         const auth=await connector.findOne({_id:req.session.uid})
res.render('settings',{auth:auth})
    }
    else
    {
    res.redirect('/')
    }
})

app.post('/update',async(req,res)=>
{
    var name=req.body.name
    var department=req.body.department
    var email=req.body.email
    if(req.session.uid)
    {
     const auth=await connector.update({_id:req.session.uid},{$set:{department:department,name:name,email:email}})
res.redirect('settings')
    }
    else
    {
    res.redirect('/')
    }
})



app.get('/schedules',async(req,res)=>
{
    if(req.session.uid)
    {
        const auth=await connector.findOne({_id:req.session.uid})
 res.render('schedule',{auth:auth})
    }
    else
    {
        res.redirect('/')
    }
})

app.post('/schedules',async(req,res) =>
{
    if(req.session.uid)
    {
        var name_sub=req.body.name_sub
        var sub_time=req.body.sub_time
        const auth=await connector.updateOne({ _id:req.session.uid },{ $push: { name_sub:name_sub,sub_time:sub_time} })
        
        res.redirect('schedules')
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
