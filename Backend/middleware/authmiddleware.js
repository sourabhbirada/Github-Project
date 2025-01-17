const jwt = require('jsonwebtoken')


function authenticatetoken(req , res, next){
    const token = req.cookies?.token;

    if(!token){
        console.log("no token");
        
        return res.status(401).json({ message: "No token provided. Please log in again." });
    }

    jwt.verify(token , process.env.JWT_KEY , (err , user) => {
        if(err){
            return res.status(403).json({ message: "Invalid token. Please log in again." });
        }

        req.userId = user.id;
        next();
    })

   
}


module.exports = authenticatetoken;