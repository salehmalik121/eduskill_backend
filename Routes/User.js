const express = require("express");
const bodyParser = require('body-parser');
const NewUser = require('../classes/newUser/newUser');
const User = require("../Classes/User/User");
const userModel = require("../Schema/Users");

const Router = express.Router();


Router.post("/GetOTP" , bodyParser.json() , (req , res , next)=>{

    const body = req.body;
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
    userModel.findOne({"Email" : email}).then(found=>{
        if(found === null){
            res.status(200).json({
                "allowed" : false,
                "message" : "No User found"
            })
        }else {
            if(found.Password === password){
                res.status(200).json({
                    "allowed" : true
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





module.exports = Router;

