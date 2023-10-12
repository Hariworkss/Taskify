// imported db.js
const db = require('./db')

// import jwt token
const jwt = require('jsonwebtoken')

// logic for register
const register=(userid,username,password)=>{
    console.log('register works')
    // check acno is in database
    return db.User.findOne({userid}).then((response)=>{
        if(response){
            return{
                statusCode:401,
                message:'userid already Registered'
            }
        }
        else{
            const newUser = new db.User({
                userid,
                username,
                password,
                projects:[]
            })
            // save to database
            newUser.save()
            //to send response back to client
            return{
                statusCode:200,
                message:'Successfully Registered'
            }

        }
    })

}

//logic for login - asynchronous function-> promise - .then
const login=(userid,password)=>{
    console.log('inside the login function')
    // console.log(acno)
    return db.User.findOne({userid,password}).then((result)=>{
      //acno present in database
        if(result){
            //token generated just below .parameters acno and secret key
            const token=jwt.sign({login:userid},'superkey2023')
            return{
                statusCode:200,
                message:'Successfully logged in', 
                currentUser:result.username,        
                token, //send to the client
                currentAcno:userid
            }
        }
        else{
            //acno not present in database
            return{
                statusCode:401,
                message:'Invalid Data'
            }
        }
    })
}



// get all users
// const getAllUsers=(userid)=>{
//     return db.User.findOne(userid).then((result)=>{
//         if(result){
//             return{
//                 statusCode:200,
//                 allUsers:result
//             }
//         }
//         else{
//             return{
//                 statusCode:401,
//                 message:"No User exits"
//             }
//         }
//     })
// }

//logic for balance enquiry
const getUser=(userid)=>{
    console.log(userid);
    return db.User.findOne({userid}).then((result)=>{
        if(result){
            return{
                statusCode:200,
                currentUser:result
            }
        }
        else{
            return{
              statusCode:401,
              message:'Invalid Data'
            }
        }
    })
}

//fund transfer
const fundTransfer=(fromAcno,fromAcnoPswd,toAcno,amt)=>{
    console.log('inside fund transferrrr')
    console.log(fromAcno)
    console.log(amt)

    //convert amt into number
    let amount=parseInt(amt)

    //check fromAcno in mongoDB
    return db.User.findOne({
        acno:fromAcno,
        password:fromAcnoPswd
    }).then((debitdetails)=>{
        if(debitdetails){  //if from acno and pass is present
            return db.User.findOne({acno:toAcno}).then((creditDetails)=>{  
                if(creditDetails){    // check if to acno 
                    if(debitdetails.balance>amount){
                        debitdetails.balance-=amount;
                        // console.log(debitdetails)  
                //pushing debit_details to transaction array in Debit_acc 
                        debitdetails.transaction.push({  
                            type:'Debit',
                            amount,
                            fromAcno,
                            toAcno
                        })
                        //save changes to mongodb
                        debitdetails.save()

                        //update toAcno
                        creditDetails.balance+=amount
                        creditDetails.transaction.push({
                            type:'credit',
                            amount,
                            fromAcno,
                            toAcno
                        })
                        //save to MongoDB
                        creditDetails.save()

                        //send response to the client side
                        return{
                            statusCode:200,
                            message:'Fund Transfer successful'
                        }


                    }
                    else{
                        return{
                            statusCode:401,
                            message:'Insufficient Balance'
                          }
                    }
                }
                else{   
                    return{
                        statusCode:401,
                        message:'Invalid Datas'
                      }
                }
            })
        }
        else{   //else of fromAcc
            return{
                statusCode:401,
                message:'Invalid Data'
              }
        }
    })
}

// Transaction history logic
const getTransationHistory=(acno)=>{
    return db.User.findOne({acno}).then((result)=>{
        if(result){
            return{
                statusCode:200,
                toUser:result,
                transaction:result.transaction
            }
        }
        else{
            return{
                statusCode:401,
                message:"Account does not exist"
            }
        }
    })
}

    //logic to delete account
    const deleteUserAccount=(userid)=>{
        //acno delete from MongoDB
        return db.User.deleteOne({userid}).then((result)=>{
            if(result){
                    return{
                        statusCode:200,
                        message:'Account deleted Successfully'
                    }
                }
            else{
                return{
                    statusCode:401,
                    message:"Account does not exist"
                }
            }
        })
    }


   //logic for add project 
   const deleteProject=(userid,proid)=>{
    console.log('inside add project logic')
    console.log(userid)
    console.log(proid);

    //check user in mongoDB
    return db.User.findOne({userid}).then((userdetails)=>{
        if(userdetails){  //if userdetails is present
            const project = userdetails.projects.find((p) => p.proid == proid);
                
            if(project){
                db.User.deleteOne({project})
                return{
                    statusCode:200,
                    message:'Account deleted Successfully'
                }
            }
                    }  
        else{   
            return{
                statusCode:401,
                message:'Invalid user data'
              }
        }
    
    })

}


    //logic for add project 
    const addProject=(userid,proid,proname)=>{
        console.log('inside add project logic')
        console.log(userid)
        console.log(proid);

        //check user in mongoDB
        return db.User.findOne({userid}).then((userdetails)=>{
            if(userdetails){  //if userdetails is present
                const project = userdetails.projects.find((p) => p.proid == proid);
                    
                if(project){
                    return{
                        statusCode:401,
                        message:'Project ID already exists'
                      }
                }
                else{
                            userdetails.projects.push({  
                                proid,
                                proname,
                                tasks:[]
                            })
                            //save changes to mongodb
                            userdetails.save()
    
                            //send response to the client side
                            return{
                                statusCode:200,
                                message:'Saved Project Details '
                            }

                         }
                        }  
            else{   
                return{
                    statusCode:401,
                    message:'Invalid user data'
                  }
            }
        
        })
    
    }

    //logic for adding task
    const addTask = (userid, proid, proname, taskname, status, taskdesc, days, hours, mins) => {
        console.log('inside add task logic');
        console.log(userid);
        console.log(proid);
    
        // Check user in MongoDB
        return db.User.findOne({ userid })
            .then((userdetails) => {
                if (userdetails) {  // If userdetails is present
                    const project = userdetails.projects.find(p => p.proid == proid);
    
                    if (project) {
                        // A project with the same projectid already exists, add the task to its tasks array.
                        project.tasks.push({
                            taskname,
                            status,
                            taskdesc,
                            days,
                            hours,
                            mins,
                        });
                    } else {
                        // The project does not exist, create a new project and add the task to it.
                        userdetails.projects.push({
                            proid,
                            proname,
                            tasks: [
                                {
                                    taskname,
                                    status,
                                    taskdesc,
                                    days,
                                    hours,
                                    mins,
                                },
                            ],
                        });
                    }
                    return userdetails.save();
                } else {
                    return Promise.reject({
                        statusCode: 401,
                        message: 'Invalid user data',
                    });
                }
            })
            .then(() => {
                return {
                    statusCode: 200,
                    message: 'Task saved',
                };
            })
            .catch((error) => {
                return error; // Return the error message or status code
            });
    }
    
    
    
    

    // Chat history logic
const getChatHistory=(acno)=>{
    return db.User.findOne({acno}).then((result)=>{
        if(result){
            console.log(result.chat)
            return{
                statusCode:200,
                toUser:result,
                chat:result.chat
            }
        }
        else{
            return{
                statusCode:401,
                message:"Account does not exist"
            }
        }
    })
}





// exports
module.exports = {
    register,
    login,
    // getAllUsers,
    fundTransfer,
    getUser,
    getTransationHistory,
    deleteUserAccount,
    addProject,
    addTask,
    // messageTransfer,
    getChatHistory
}
