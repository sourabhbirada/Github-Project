const jwt = require('jsonwebtoken')


function authenticatetoken(req , res, next){
     

  const token = req.cookies?.token || req.headers['authorization']?.split(' ')[1];

    

    if(!token){
        const error = new Error("No token provided. Please log in again.")
        error.status = 401
        return next(error)
    }
    jwt.verify(token , process.env.JWT_KEY , (err , user) => {
        if(err){
            const error = new Error("Invalid token. Please log in again.")
            error.status = 403
            return next(error)
        }
        req.userId = user.id;
        next();
    })

   
}


module.exports = authenticatetoken;