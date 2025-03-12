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
        const owner = await User.findById(req.user.id)
        if (user.followers.includes(owner._id)) {
            await User.findByIdAndUpdate(owner._id, {
                $set: {
                    following: [...owner.following, user._id]
                }
            })
            return res.json({ success: "added to following" })
        } else {
            const following = owner.following
            const updatedfollowing = following.filter((followed) => {
                return followed.toString() !== req.params.id
            })
            await User.findByIdAndUpdate(req.user.id, {
                $set: {
                    following: updatedfollowing
                }
            })
            return res.json({ success: "remove from following" })
        }
    } catch (error) {
        res.status(500).send({ error: error.message })
    }
})

module.exports = router