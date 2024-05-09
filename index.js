const express = require('express');
const app = express();
const dotenv = require('dotenv');
dotenv.config({});
const userRoute = require('./routes/user')

const port = process.env.PORT || 5000

app.use('/user',userRoute);
app.use(express.json());

app.get('/',(req,res)=>{
    res.status(200).json({
        message:"Hello My name is Pranjul Shukla"
    })
});

app.listen(port,()=>{
    console.log(`The website has started on ${port}`)
})
