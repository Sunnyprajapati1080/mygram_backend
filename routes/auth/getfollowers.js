const express = require('express')
const router = express.Router()
const fetchUser = require("../../middlewares/fetchUser")
const User = require('../../models/user')

router.get('/:id', fetchUser, async (req, res) => {
    try {
        const followers = await User.findById(req.params.id).populate("followers")
        res.json(followers)
    } catch (error) {
        res.status(500).send({ error: error.message })
    }
})

module.exports = router