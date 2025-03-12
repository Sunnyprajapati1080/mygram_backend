const express = require('express')
const router = express.Router()
const fetchUser = require('../../middlewares/fetchUser')
const Post = require('../../models/post')

router.get('/',fetchUser,async (req,res)=>{
    try {
        const allposts = await Post.find({}).populate("user").sort({ createdAt: -1 })
        const posts = allposts.map((post)=>{
            return {...post,liked: post.likedUsers.includes(req.user.id)?true:false}
        })
        res.json({posts})
    } catch (error) {
        res.status(500).send({ error: error.message })
    }
})

module.exports = router