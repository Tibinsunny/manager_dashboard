const mongoose=require('mongoose')

const conn=new mongoose.Schema({
    name:{
        type:String,
    },
    password:{
        type:String,
    },
    email:{
        type:String,
    },
    department:{
        type:String,
    },
    name_sub:{
        type:[String],
    },
    sub_time:{
        type:[String],
    },

})
module.exports=mongoose.model('reg',conn)