const express = require('express')
const router = express.Router()

router.use("/createPost",require("./createpost"))
router.use("/getAllPosts",require("./getAllPosts"))
router.use("/getOwnPosts",require("./getOwnPosts"))
router.use("/getcomments",require("./getcomments"))
router.use("/postcomment",require("./postcomment"))
router.use("/getHomePosts",require("./getHomePosts"))
router.use("/updateLikes",require("./updateLikes"))
router.use("/updateFollowing",require("./updateFollowing"))
router.use("/updateFollowers",require("./updateFollowers"))
router.use("/getUserPosts",require("./getuserposts"))

module.exports = router