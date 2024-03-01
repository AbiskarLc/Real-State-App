const mongoose = require('mongoose');
const url =  process.env.DATABASE_URL;
const connectDbs = async () =>{
    try {
      await mongoose.connect(url).then(()=>{

        console.log("Connected to Database Successfully")
      }).catch(()=>{
        console.log("Connection Failed")
      });
     
        
    } catch (error) {
        
    }
        

};

module.exports = connectDbs;
