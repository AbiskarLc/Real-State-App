require("dotenv").config();
const express = require("express");
const connectDbs = require("./Database/connection");
const app = express();
const port = process.env.PORT || 8000;


connectDbs().then(() => {
  app.listen(port, () => {
    console.log(`listening at port ${port}`);
  });
});
