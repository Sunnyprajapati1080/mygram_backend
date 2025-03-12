const express = require('express')
const router = express.Router()
const fetchUser = require("../../middlewares/fetchUser")
const User = require('../../models/user')

router.get('/:id', fetchUser, async (req, res) => {
    try {
        const following = await User.findById(req.params.id).populate("following")
        res.json(following)
    } catch (error) {
        res.status(500).send({ error: error.message })
    }
})

module.exports = router