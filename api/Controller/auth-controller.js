const User = require("../Database/Model/User");

const bcrypt = require('bcrypt');

const signupUser = async (req,res,next) =>{

    try {

const {username,email,password} = req.body;

if(!username || !email || !password){
    
    return next({status:400,message:"Field must not be empty",extraDetails:"Error occurred"});
}
const userExist = await User.findOne({email:email});
if(userExist){

    return next({status:400,message:"User Already created"});
}

const hashpassword = await bcrypt.hash(password,10);
     const createduser = await User.create({username,email,password:hashpassword});

     if(createduser){


        return res.status(200).json({message:"User created successfully",createduser});
     }


        
    } catch (error) {

        next(error);
    }
}



module.exports = {signupUser}