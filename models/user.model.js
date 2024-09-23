const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
fullname :{
    type:String
},
email :{
    type:String
},
password :{
    type:String
},
cart:[{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'product'
}],
orders:{
    type:Array,
    default:[]
},
contact:{
    type:Number,
},

picture:String
})

module.exports=mongoose.model("user",userSchema)