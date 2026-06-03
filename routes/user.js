const express=require("express");
const router=express.Router();
const passport=require("passport");
const wrapAsync = require("../utils/wrapAsync.js");
const {saveRedirectUrl}=require("../middleware.js");
const userController=require("../controllers/user.js");

router.route("/signup")
//to signup or create an account
    .get(userController.signupForm)
//to post the new account
    .post(wrapAsync(userController.signupSubmit))

router.route("/login")
//for login page
    .get(userController.loginForm)
//after login clicked
    .post(saveRedirectUrl, passport.authenticate("local",{failureRedirect:"/login", failureFlash:true}),userController.loginSubmit)

//to logout
router.get("/logout", userController.logout)
module.exports=router;