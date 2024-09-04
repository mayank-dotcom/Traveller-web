const { compile } = require('ejs');
const express = require('express');
const app = express();
const port = 8080;
const ExpressError = require('./ExpressError');
const e = require('express');
const checkToken = (req,res,next) => {
    let{token}=req.query;
    if(token==="access"){
        next();
    }
    throw new ExpressError(401, "Acess denied");
};
app.get('/api/',checkToken,(req,res)=>{
    res.send("data");
});
app.get('/', (req,res)=>{
    console.log("working");
})
app.get("/err",(req,res)=>{
    abcd = abcd;
})
app.get('/admin',(req,res)=>{
    throw new ExpressError(403, "access denied");
})
app.use((err,req,res,next)=>{
    let{status,message}=err;
    res.status(status).send(message);
})
app.listen(port , (err,res)=>{
    console.log("listening");
});
