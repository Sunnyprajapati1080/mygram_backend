const express = require("express");
const router = express.Router()
const fetchUser = require("../../middlewares/fetchUser")
const User = require("../../models/user")

router.get('/:id', fetchUser, async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select("-password")
        if (!user) {
            return res.status(404).json({ error: "user not found!" })
        }
        if (user._id.toString() === req.user.id) {
            return res.json({ own: true})
        }
        if (user.followers.includes(req.user.id)) {
            return res.json({...user,followed:true})
        }
        res.json({...user,followed:false})
    } catch (error) {
        res.status(500).send({ error: `internal server error occured: ${error.message} ` })
    }
})

module.exports = router