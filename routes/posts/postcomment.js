const express = require('express')
const router = express.Router()
const fetchUser = require('../../middlewares/fetchUser')
const Post = require('../../models/post')
const User = require('../../models/user')


router.post('/:id',fetchUser,async (req,res)=>{
    try {
        const post = await Post.findById(req.params.id)
        const user = await User.findById(req.user.id)
        const postowner = await User.findById(post.user.toString())

        await Post.findByIdAndUpdate(req.params.id,{$set:{
            comments:[{message:req.body.comment,user:req.user.id},...post.comments]
        }})
        await User.findByIdAndUpdate(post.user,{$set:{
            activities:[{username:user.username,id:user._id,profileImg:user.profileImg,postId:post._id,message:"commented on your post",postImg:post.img,comment:true},...postowner.activities]
        }})
        res.json({success:"success"})
    } catch (error) {
        res.status(500).send({ error: error.message })
    }
})

module.exports = router