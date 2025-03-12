const express = require('express')
const router = express.Router()
const User = require('../../models/user')
const fetchUser = require('../../middlewares/fetchUser')

router.patch('/:id', fetchUser, async (req, res) => {
    try {
        if (req.params.id === req.user.id) {
            return res.status(400).json({ error: "not allowed" })
        }
        const user = await User.findById(req.params.id)
        if (user.followers.includes(req.user.id)) {
            const updatedfollowers = user.followers.filter((follower) => {
                return follower.toString() !== req.user.id
            })
            await User.findByIdAndUpdate(req.params.id, {
                $set: {
                    followers: updatedfollowers
                }
            })
            return res.json({ success: "unfollowed" })
        }else {
            const followers = user.followers
            await User.findByIdAndUpdate(req.params.id, {
                $set: {
                    followers: [...followers, req.user.id]
                }
            })
            const user2 = await User.findById(req.user.id)

            await User.findByIdAndUpdate(req.params.id,{$set:{
                activities:[{username:user2.username,id:user2._id,profileImg:user2.profileImg,message:"following you"},...user.activities]
            }})
            return res.json({ success: "followed" })
        }
    } catch (error) {
        res.status(500).send({ error: error.message })
    }
})

module.exports = router