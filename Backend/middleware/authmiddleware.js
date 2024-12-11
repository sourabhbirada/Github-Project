const jwt = require('jsonwebtoken')


function authenticatetoken(req , res, next){
    const token =  req.headers['authorization']?.split(' ')[1];

    if(!token){
        return res.json({message:"no token"})
    }

    jwt.verify(token , process.env.JWT_KEY , (err , user) => {
        if(err){
            return res.json({message:"invaild token"})
        }

        req.userId = user.id;
        next();
    })

   
}


module.exports = authenticatetoken;