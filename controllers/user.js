const passport=require("passport");
const {saveRedirectUrl}=require("../middleware.js");
const user=require("../models/user.js");

//to signup or create an account
module.exports.signupForm= (req,res)=>{
    res.render("./users/signup.ejs");
}

//to post the new account
module.exports.signupSubmit=async (req,res,next)=>{
    try{
        let {username, email, password}=req.body;
        const newUser=new user({username, email});
        const regUser= await user.register(newUser, password);
        req.login(regUser,(err)=>{
            if(err){
                return next(err);
            }
            req.flash("success", "Signed Up successfully!");
            res.redirect("/listings");
        })
    }catch(error){
        req.flash("error", error.message);
        res.redirect("/signup");
    }
}

//for login page
module.exports.loginForm=(req,res)=>{
    res.render("./users/login.ejs");
}

//after login clicked
module.exports.loginSubmit=async (req,res)=>{
    req.flash("success", "Welcome back!");
    const redirectUrl=res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
}

//on clicking logout
module.exports.logout=(req,res)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        } 
        req.flash("success","You are logged out successfully!") 
        res.redirect("/listings");
    })
}