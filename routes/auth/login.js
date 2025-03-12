const bcrypt = require("bcryptjs");
const express = require("express");
const {validationResult, body } = require("express-validator");
const jwt = require("jsonwebtoken");
const router = express.Router()
const User = require("../../models/user")

router.post('/', [
    body("email","enter a valid email").isEmail(),
    body("password","password cannot be blank").isLength({min:1})
], async(req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(401).json({ errors })
    }
    try {
        const user = await User.findOne({email:req.body.email})
        if(!user){
            return res.status(401).json({ error:"please try to login with correct credentials!" })
        }
        const password = await bcrypt.compare(req.body.password,user.password)
        if(!password){
            return res.status(401).json({ error:"please try to login with correct credentials!" })
        }
        const token = jwt.sign({id:user._id}, process.env.JWT_SECRET)
        res.json({token,id:user._id,username:user.username})
    } catch (error) {
        res.status(500).send({ error: `internal server error occured: ${error.message} `})
    }
})

module.exports = router