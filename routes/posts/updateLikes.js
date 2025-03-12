const express = require('express')
const router = express.Router()
const Post = require('../../models/Post')
const fetchUser = require('../../middlewares/fetchUser')
const User = require('../../models/user')

router.patch('/:id', fetchUser, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
        if (post.likedUsers.includes(req.user.id)) {
            const updateduserslist = post.likedUsers.filter((userId) => {
                return userId.toString() !== req.user.id
            })
            await Post.findByIdAndUpdate(req.params.id, {
                likedUsers: updateduserslist,
                likes: post.likes - 1
            })
            return res.json({ likes: post.likes })
        } else {
            await Post.findByIdAndUpdate(req.params.id, {
                likedUsers: [...post.likedUsers, req.user.id],
                likes: post.likes + 1
            })

            const user = await User.findById(req.user.id)
            const postowner = await User.findById(post.user.toString())

            await User.findByIdAndUpdate(post.user, {
                $set: {
                    activities: [{ username: user.username, id: user._id, profileImg: user.profileImg, postId: post._id, message: "liked your post", postImg: post.img }, ...postowner.activities]
                }
            })
            return res.json({ likes: post.likes })
        }
    } catch (error) {
        res.status(500).send({ error: error.message })
    }
})

module.exports = router