const {PrismaClient} = require('@prisma/client');
const prisma =new PrismaClient();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
dotenv.config({});



exports.register = async(req,res)=>{
    try {
        const {username,password} = req.body;
        if(!username ){
            return res.status(401).json({
                message:"Please Enter Username"
            })
        }
        if(!password){
            return res.status(401).json({
                message:"Please Enter Password"
            })
        }
    
        if(password.length<6){
            return res.status(403).json({
                message:"Password length should be minimum 6 characters"
            })
        }
        const user = await prisma.user.findMany({
            where:{
                username
            }
        });
    
        if(user.length>0){
            return res.status(402).json({
                message:"User already exists"
            })
        };
    
        const hashedPassword = await bcrypt.hash(password,10);
    
        const token = generateAccessToken({username:username});

        const RefreshToken = generateRefreshToken({username:username});


    
    
    
        const User =  await prisma.user.create({
            data:{
                username,
                password:hashedPassword,
                refreshtoken:RefreshToken
    
            }
           
        });
    
        const options = {
            expires:new Date(Date.now() + 90*24*60*60*1000)
        
            
        }
    
    
    
        res.cookie("token",token,options).status(200).json({
            message:"User Registered Successfully",
            User,
            token
        })
        
    
    } catch (error) {
        res.status(500).json({
            message:"Internal Server Error",
            error:error.message
        })
        
    }
 



}

exports.login = async(req,res)=>{

    const {username, password} = req.body;

    if(!username ){
        return res.status(401).json({
            message:"Please Enter Username"
        })
    }
    if(!password){
        return res.status(401).json({
            message:"Please Enter Password"
        })
    };




    const user = await prisma.user.findFirst({
        where:{
            username,
        }
    });
    
    if(!user){
        return res.status(401).json({
            message:"User not found please register first"
        });

    };

    


    const isMatch = await bcrypt.compare(password,user.password);
    if(!isMatch){
        return res.status(402).json({
            message:"Wrong password please try again"
        })
    }

 
    const token = await jwt.sign({username:username},process.env.JWT_SECRET_KEY);

    const options ={
        expires:new Date(Date.now() + 90*24*60*60*1000)
    }

    res.cookie("token",token,options).json({
        messsage:"User logged in successfully",
        user,
        token,

    });






    
}

exports.dashboard = async(req,res)=>{
    try {
        res.status(200).json({
            message:"If you have reached the dashboard means you are authenticated"
        })
        
    } catch (error) {
        res.status(500).json({
            message:"Internal Server Error"
        })
        
    }
};

exports.logout = async(req,res)=>{
    try {
        const options = {
            expires:new Date(Date.now())
        }
        res.status(200).cookie("token",null,options).json({
            message:"User Logged Out SuccessFully"
        })
        
    } catch (error) {
        res.status(500).json({
            message:"Internal Server Error",
            error:error.message
        })
        
    }
}
exports.refreshtoken = async(req,res)=>{
    try {
        const {refreshtoken , username} = req.body;
        
        if(!refreshtoken){
            return res.status(400).json({
                message:"Refresh Token is required"
            })
        }

        await jwt.verify(refreshtoken,process.env.JWT_SECRET_KEY,(err,user)=>{
            if(err) return res.status(401).json(
            {
                message:"Invalid Refresh Token"
            }
            );

            const token = generateAccessToken({username:username});
            res.status(200).json({
                token
            })
        })

        
    } catch (error) {
        res.status(500).json({
            message:"Internal Server Error",
            error:error.message
        })
    }
}

function generateAccessToken (payload){
    return jwt.sign(payload,process.env.JWT_SECRET_KEY,{expiresIn:'15m'});
}

function generateRefreshToken(payload){
    return jwt.sign(payload,process.env.JWT_SECRET_KEY);
}