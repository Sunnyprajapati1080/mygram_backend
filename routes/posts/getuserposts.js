const express = require('express')
const router = express.Router()
const fetchUser = require('../../middlewares/fetchUser')
const post = require('../../models/post')

router.get('/:id',fetchUser,async (req,res)=>{
    try {
        res.json(await post.find({user:req.params.id}).sort({createdAt:-1}))
    } catch (error) {
        res.status(500).send({ error: error.message })
    }
})

module.exports = router