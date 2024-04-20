const express = require('express');

const router = express.Router();
const controller = require("../Controller/user-controller");
const verifyUser = require('../utils/VerifyUser');


router.route("/updateUser/:userId").put(verifyUser,controller.updateUser);
router.route("/deleteUser/:userId").delete(verifyUser,controller.deleteUser)
module.exports = router;