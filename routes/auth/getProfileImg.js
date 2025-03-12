const express = require("express");
const router = express.Router()
const fetchUser = require("../../middlewares/fetchUser")
const User = require("../../models/user")

router.get('/', fetchUser, async (req, res) => {
    try {
        const profile = await User.findOne({ _id: req.user.id }).select("profileImg")
        if (!profile) {
            return res.status(401).json({ error: "user not found!" })
        }
        res.json(profile)
    } catch (error) {
        res.status(500).send({ error: `internal server error occured: ${error.message} ` })
    }
})

module.exports = router