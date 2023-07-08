const asyncHandler = require("express-async-handler")
const jwt = require("jsonwebtoken")


const validateToken = asyncHandler((req,res,next)=>{
    let token;

    if(!req.session.tutJWT){
        let authHeader = req.headers.Authorization || req.headers.authorization
            if(authHeader && authHeader.startsWith("Bearer")){
                token = authHeader.split(" ")[1]
                jwt.verify(token,process.env.ACCESS_TOKEN_SECRET, (err,decoded)=>{
                    if(err){
                        req.session.currentTutorObj = null
                        res.status(401)
                        throw new Error("User is not authorized to access at this time. Either Token expired or Token is Invalid")
                    }
                    //console.log(decoded)
                    console.log("Token verified Successfully.")
                    // req.user = decoded.userInfo;
                    // console.log(req.user)
                    next();
                })

                if(!token){
                    res.status(401)
                    throw new Error("Either Token expired or Token is Invalid")
                }
            }else{
                res.status(401)
                throw new Error("Validation Token is missing. Try Logging In first, then route with the token.")
            }
    }else{
        token = req.session.tutJWT
        jwt.verify(token,process.env.ACCESS_TOKEN_SECRET, (err,decoded)=>{
            if(err){
                res.status(401)
                throw new Error("User is not authorized to access at this time. Either Token expired or Token is Invalid")
            }
            //console.log(decoded)
            console.log("Token verified Successfully. Serving the Request :)")
            // req.user = decoded.userInfo;
            // console.log(req.user)
            next();
        })

        if(!token){
            res.status(401)
            throw new Error("Either Token expired or Token is Invalid. Try re-login again")
        }
    }
    
})

module.exports = validateToken