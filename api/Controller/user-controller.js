const User = require("../Database/Model/User");
const bcrypt = require("bcrypt");

const updateUser = async (req, res, next) => {
  try {
    const userId = req.params.userId;

    const { id } = req.user;

    if (userId !== id) {
      return next({ status: 401, message: "Access Denied" });
    }

    const dataToBeUpdated = {};
    const { username, profilePicture, password } = req.body;

    if (username) {
      dataToBeUpdated.username = username;
    }
    if (password) {
      const hashpassword = await bcrypt.hash(password, 10);

      dataToBeUpdated.password = hashpassword;
    }
    if (profilePicture) {
      dataToBeUpdated.profilePicture = profilePicture;
    }

    const updatedData = await User.findByIdAndUpdate(userId, dataToBeUpdated, {
      new: true,
    });

    if (!updatedData) {
      return next({ status: 400, message: "Failed to update user" });
    }
    console.log(updatedData);

    const { password: pass, ...rest } = updatedData._doc;
    console.log(rest);

    return res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};


const deleteUser = async(req,res,next) =>{

    

    try {

        const {id} = req.user;
        const userId = req.params.userId;

        if(id!==userId){
console.log("hello");
            return next({status:401,message:"Unauthorized Access",extrDetails:"Unable to delete the account"});
        }
        
        const deletedUser = await User.findByIdAndDelete(userId);
        console.log("hello");
        if(!deletedUser){
            return next({status:500,message:"Unable to delete the user"});
        }

        const {password:pass,...rest} = deletedUser._doc;
        console.log("hello");
         return res.clearCookie('token').status(200).json({message:"User deleted Successfully",rest});

    } catch (error) {
        console.log("hello");
        console.log(error);
        next(error);
    }
}

module.exports = { updateUser,deleteUser };
