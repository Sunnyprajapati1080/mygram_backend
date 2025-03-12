const express = require('express')
const router = express.Router()

router.use("/createUser", require("./createUser").router)
router.use("/login", require("./login"))
router.use("/getProfileImg", require("./getProfileImg"))
router.use("/getUserDetails", require("./getUserDetails"))
router.use("/getuser", require("./getUser"))
router.use("/getfollowers", require("./getfollowers"))
router.use("/getfollowing", require("./getfollowing"))
router.use("/getactivities", require("./getactivities"))

module.exports = router
