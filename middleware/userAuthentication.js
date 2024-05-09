const dotenv = require('dotenv')
const jwt = require('jsonwebtoken');
const {PrismaClient} = require('@prisma/client');
const prisma =new PrismaClient();
const cookieParser = require('cookie-parser');


exports.isAuthenticated = async(req,res,next)=>{
    try{
  

    const {token} = req.cookies;
        if(!token){
            return res.status(400).json({
                message:"Please Login First"
            });
        };
    
        const decoded = await jwt.verify(token,process.env.JWT_SECRET_KEY);
         req.user = await prisma.user.findFirst({
            where:{
                username:decoded.username
            }
         });
    
         next();

    }

    catch(error){
        res.status(500).json({
            message:"Internal Server Error",
            error:error.message
        })
        }
  


}