
const List = require("../Database/Model/List");
const createList = async(req,res,next) => {

console.log(req.body);
    try {


        const list = await List.create(req.body);

        if(!list){
            return next({status:400,message:"Failed to create a property data"});
        }
        
        
        return res.status(200).json({message:'Property added successfully',list})
        
    } catch (error) {
        next(error);
    }
}

module.exports = {createList}