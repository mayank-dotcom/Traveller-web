const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync.js');
const User = require("../models/user.js");
const passport = require('passport');
const req = require('express/lib/request.js');
router
.route(
    '/signup'
)
.get((req,res)=>{
    res.render("./users/signup.ejs");
})
.post(wrapAsync(async(req,res)=>{
    try{
        let{username,password,email} = req.body;
        const newUser = new User({username,email});
        let registeredUser =  await User.register(newUser,password);
        req.flash('success',"Profile created successfully !");
        req.session.userId = registeredUser._id; // Set the user ID in the session
        res.redirect('/home');
    }
    catch (e) {
        req.flash('del', e.message);
        res.redirect('/login');
    }
}))
router.route('/login')
.get ((req,res)=>{
    res.render("./users/login.ejs");
})
.post(passport.authenticate("local",{
    failureRedirect:'/login',
    failureFlash:true,
    }),
    async(req, res)=>{
        req.flash('success',"Successfully logged in !");
        req.session.userId = req.user._id; // Set the user ID in the session
        res.redirect("/home");
    }
)
router.get("/logout",(req,res,next)=>{
    req.logout((err)=>{
        if(err){
            next(err);
        }
        req.flash("success","You have been logged out");
        res.redirect("/home");
    })
})
module.exports = router;
