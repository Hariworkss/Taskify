// Database connecton with mongoose

const mongoose = require('mongoose');

//defined a connection string  between express and mongoDB
mongoose.connect('mongodb://localhost:27017/Taskify')

//Model and its schema for storing data in to the database
//Model in express same as mongodb collection name (but in capitalcase and singular form , eg- users-> User )
const User = mongoose.model('User',{
    userid:Number,
    username:String,
    password:String,
    projects:[
        {
            proid: Number,
            proname: String,
            tasks: [{
                taskname: String,
                status: String,
                taskdesc: String,
                days: Number,
                hours: Number,
                mins: Number
            }]
        }
    ],
    // tasks:[]

})

//exporting 
module.exports = {
    User
}

// const User = mongoose.model('User',{
//     acno:Number,
//     username:String,
//     password:String,
//     image:String,
//     balance:Number,
//     transaction:[],
//     chat:[]

// })