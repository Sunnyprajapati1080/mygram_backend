const jwt = require("jsonwebtoken");
const fetchUser = async (req, res, next) => {
    const token = req.header("token")
    if (!token) {
        return res.status(401).json({ error: "you need to sign in first!" })
    }
    jwt.verify(token, process.env.JWT_SECRET, (err,data) => {
        if(err){
            res.json(err)
        }else{
            req.user = data
            next()
        }
    })
}
module.exports = fetchUser