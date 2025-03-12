const express = require('express')
const router = express.Router()
const fetchUser = require('../../middlewares/fetchUser')
const post = require('../../models/post')
const User = require('../../models/user')

router.get('/', fetchUser, async (req, res) => {
    try {
        const user = await User.findById(req.user.id)
        const allposts = await post.find({}).populate("user").sort({ createdAt: -1 })
        const selectedPosts = allposts.filter((post) => {
            if (user.following.includes(post.user._id)) {
                return user.following.includes(post.user._id)
            }
            else if (post.user._id.toString() === req.user.id)
                return post.user._id.toString() === req.user.id
        })
        const posts = selectedPosts.map((post)=>{
            return {...post,liked: post.likedUsers.includes(req.user.id)?true:false}
        })
        res.json({posts})
    } catch (error) {
        res.status(500).send({ error: error.message })
    }
})

module.exports = router