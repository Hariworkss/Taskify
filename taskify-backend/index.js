//1 import express
const express = require("express"); 

//2 create a server using express
const server=express();

//8 import logic
const logic = require('./services/logic')

// import jwt token
const jwt = require('jsonwebtoken')

//3 setup port server  
server.listen(6002,()=>{
    console.log("Listening on the port 6001")
   }) 

//4 import cors
const cors = require("cors");

//5  use cors in server app
server.use(cors({
    origin:"http://localhost:4200"
}))  

//6 Parse json data to the js in server app
server.use(express.json())

// application specific middleware     
// const appMiddleware =(req,res,next)=>{
//     next()
//     console.log('application specific middleware');
// }
// use app specific middleware
// server.use(appMiddleware)
// Router specific middleware
//middleware for verifying token to check user is logged in or not
const jwtMiddleware = (req,res,next)=>{

    //get token from req header
    const token=req.headers['verify-token']; //token
    console.log(token); //token verify
     try{
       const data=jwt.verify(token,'superkey2023')
       console.log(data);
       req.currentAcno=data.loginAcno  //just look passing to fund transfer
       next()
     }
     catch{
       res.status(401).json({message:'please login'})
     }
     console.log(req.currentAcno)

    console.log('Router specific middleware') 
   
   }




// resolving client requests - 6000/

// register call
server.post('/register',(req,res)=>{
    
    logic.register(req.body.acno,req.body.username,req.body.password).then((result)=>{
        res.status(result.statusCode).json(result)
        console.log(req.body)
    })
    
    // res.send('Register req recieved')
    // res.status(200).json({message:'request recieved  '})
})


// login api call
server.post('/login',(req,res)=>{
    console.log('inside the login api call');
    console.log(req.body)
    logic.login(req.body.acno,req.body.password).then((result)=>{
      res.status(result.statusCode).json(result)
    })
  })

// all users api call
server.get('/getallusers/:userid',(req,res)=>{
    console.log('Inside getallusers')
    logic.getAllUsers().then((result)=>{
        res.status(result.statusCode).json(result)
    })
})

  //getBalance api call
  
  // get user api call
  server.get('/getuser/:userid',jwtMiddleware,(req,res)=>{
    console.log('inside getBalance')
    console.log(req.params);
    logic.getUser(req.params.userid).then((result)=>{
    res.status(result.statusCode).json(result)
  
    })
  })


//fund transfer api call
server.post('/fund-transfer',jwtMiddleware,(req,res)=>{
    console.log('inside the fund transfer')
    console.log(req.body)
     //getting acno from jwt middleware above
    logic.fundTransfer(req.body.curAcno,req.body.password,req.body.toAcno,req.body.amount)  
    .then((result)=>{
      res.status(result.statusCode).json(result)
    })
  })

  // add project api call
  server.post('/add-project',jwtMiddleware,(req,res)=>{
    console.log('inside the add project')
    console.log(req.body)
     //getting acno from jwt middleware above
    logic.addProject(req.body.useridNum,req.body.proid,req.body.proname)  
    .then((result)=>{
      res.status(result.statusCode).json(result)
    })
  })

  // add task api call
  server.post('/add-task',jwtMiddleware,(req,res)=>{
    console.log('inside the add task')
    console.log(req.body)
     //getting acno from jwt middleware above
    logic.addTask(req.body.userid,req.body.proid,req.body.proname,req.body.taskname,req.body.status,req.body.taskdesc,req.body.days,req.body.hours,req.body.mins)  
    .then((result)=>{ 
      res.status(result.statusCode).json(result)
    })
  })



//delete acc api call
server.delete('/delete-account/:acno',jwtMiddleware,(req,res)=>{
  console.log('Inside deleteAccount')
  logic.deleteUserAccount(req.params.acno).then((result)=>{
    res.status(result.statusCode).json(result)
  })
})

  