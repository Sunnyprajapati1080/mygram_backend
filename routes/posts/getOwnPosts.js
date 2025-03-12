const express = require('express')
const router = express.Router()
const fetchUser = require("../../middlewares/fetchUser")
const post = require('../../models/post')

router.get('/', fetchUser, async (req, res) => {
    try {
        const data = await post.find({ user: req.user.id }).sort({ createdAt: -1 }).select("img")
        res.json(data)
    } catch (error) {
        res.status(500).send({ error: error.message })
    }
})

module.exports = router