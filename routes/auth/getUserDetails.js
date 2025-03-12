const express = require("express");
const router = express.Router()
const fetchUser = require("../../middlewares/fetchUser")
const User = require("../../models/user")

router.get('/', fetchUser, async (req, res) => {
    try {
        const details = await User.findOne({ _id: req.user.id }).select("-password")
        if (!details) {
            return res.status(401).json({ error: "user not found!" })
        }
        res.json(details)
    } catch (error) {
        res.status(500).send({ error: `internal server error occured: ${error.message} ` })
    }
})

module.exports = router