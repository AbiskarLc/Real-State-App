const express = require('express');
const router = express.Router();
const controller = require("../Controller/listing-controller");
const verifyUser = require('../utils/VerifyUser');


router.route("/createList").post(verifyUser,controller.createList)
module.exports = router;