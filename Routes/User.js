const express = require("express");
const bodyParser = require('body-parser');
const NewUser = require('../classes/newUser/newUser');
const User = require("../classes/User/User");
const userModel = require("../Schema/Users");
const jwt = require("jsonwebtoken");

const Router = express.Router();
const key ="a4e27f15bb12d99897a30b35ead719a81ad6a37ade8b0f0251453b2ebc03a600";

Router.post("/GetOTP" , bodyParser.json() , async(req , res , next)=>{

    const body = req.body;

    const userList = await userModel.find({ "Email": { $regex: new RegExp('^' + body.Email + '$' , 'i') }});

    if(userList.length != 0){ 
        res.status(200).json({
          type: "err",
          message: "User Already Exist With this Email",
        })

        return;

    }


    const User = new NewUser(body.FirstName , body.LastName , body.Email);
    const jwtToken = User.getPublicToken();

    res.status(200).json({jwtToken});
})

Router.post("/verifyOTP" , bodyParser.json() , (req , res , next)=>{

    const body = req.body;
    const User = new NewUser(body.FirstName , body.LastName , body.Email);
    const state = User.verifyOTP(body.token , body.OTP)

    res.status(200).json(state);
})

Router.post("/saveUser" , bodyParser.json() , async(req , res , next)=>{
    const body = req.body;
    const token = body.token;
    const password = body.password;

    const _User = new User(token);
    await _User.saveUser(password);
    res.sendStatus(200);
})

Router.post("/login" , bodyParser.json() , async(req , res , next)=>{
    const email = req.body.email;
    const password = req.body.password;
    console.log(req.body);
    userModel.findOne({ "Email": { $regex: new RegExp('^' + email + '$' , 'i') }}).then(found=>{
        console.log(found);
        if(found === null){
            res.status(200).json({
                "allowed" : false,
                "message" : "No User found"
            })
        }else {
            if(found.Password === password){
                const jwtToken = jwt.sign(
                    { Email: email},
                    key,
                  );
                res.status(200).json({
                    "allowed" : true,
                    "token" : jwtToken
                })
            }else{
                res.status(200).json({
                    "allowed" : false,
                    "message" : "Invalid Credentials"
                })
            }
        }
    })

})

Router.post("/forgotPassWordOTP" , bodyParser.json() , async(req , res , next)=>{
    const email = req.body.Email;
    const user = new User();
    const returnJson = await user.forgotPassword(email);
    console.log(returnJson)
    res.status(200).json(returnJson);
})

Router.post("/forgotPassWordOTPVerification" , bodyParser.json() , async(req , res , next)=>{
    const body = req.body;
    console.log(body);
    const user = new User();
    const returnJson = user.verifyOTP(body.token , body.OTP , body.Email)
    console.log(returnJson)
    res.status(200).json(returnJson);
})

Router.post("/UpdatePassword" , bodyParser.json() , async(req , res , next)=>{
    const body = req.body;
    const token = body.token;
    const password = body.password;
    console.log(token);
    const _User = new User(token);
    await _User.updatePassword(password);
    res.sendStatus(200);
})





module.exports = Router;

