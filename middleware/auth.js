const jwt = require("jsonwebtoken");

const config = require("config");

module.exports = function(req, res, next){
    //get token from header 
    const token = req.header('x-auth-token')

    //cek kalo token salah
    if(!token){
        return res.status(401).json({ msg: "isi token guys"})
    }
    try {
        const decoded =  jwt.verify(token, config.get('jwtsecret'))
        req.user = decoded.user
        next()
    } catch (err){
        res.status(401).json({ msg: "token salah gays!"})
    }
}