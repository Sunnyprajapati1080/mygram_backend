const express = require('express')
const router = express.Router()
const fetchUser = require("../../middlewares/fetchUser")
const User = require('../../models/user')

router.get('/', fetchUser, async (req, res) => {
    try {
        const user = await User.findById(req.user.id)
        res.json({activities:user.activities})
    } catch (error) {
        res.status(500).send({ error: error.message })
    }
})

module.exports = router