const express = require('express')
const router = express.Router()
const fetchUser = require('../../middlewares/fetchUser')
const Post = require('../../models/post')

router.get('/:id',fetchUser,async (req,res)=>{
    try {
        const post = await Post.findById(req.params.id).populate({path:"comments",populate:"user"})
        res.json(post)
    } catch (error) {
        res.status(500).send({ error: error.message })
    }
})

module.exports = router