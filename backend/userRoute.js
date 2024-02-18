const express = require("express");
const { UserModel } = require("../backend/usermodel");
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const nodemailer = require('nodemailer');

const userRoute = express.Router();

userRoute.use(express.json());

function generateOtp(){
   return Math.floor(1000+Math.random()*9000);
}

const transporter = nodemailer.createTransport({
    service : "gmail",
    port : 465,
    auth : {
        user : "aniket357baghel@gmail.com",
        pass: "vpuo imkz dtbg alzr"
    },
    tls: {
        rejectUnauthorized: false // Ignore TLS certificate errors (not recommended for production)
    }
})


userRoute.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const user = await UserModel.findOne({ email });
        if (user) {
            res.status(200).json({ msg: "You are already registered. Please login." });
        } else {
            bcrypt.hash(password, 5, async(err, hash) => {
                if (err) {
                    res.status(200).json({ error: err });
                } else {
                    try {
                        const newUser = new UserModel({ name, email, password: hash });
                        await newUser.save();
                        res.status(200).json({ msg: "New user got registered" });
                    } catch (err) {
                        res.status(400).json({ error: err });
                    }
                }
            })
        }
    } catch (err) {
        res.status(400).json({ error: err });
    }
})

userRoute.post('/login',async(req,res)=>{
    const {email,password} = req.body;
    const user = await UserModel.findOne({email});
    if(user){
        bcrypt.compare(password, user.password, async(err, result)=> {
            if(result){
               const token = jwt.sign({userId : user.id},"Aniket");
                res.status(200).json({msg : "You are logged in", token});
            }
            else{
                res.status(200).json({error:err});
            }
        });
    }
    else{
        res.status(200).json({msg : "please register"});
    }
})

userRoute.post('/forget-password',async(req,res)=>{
    try{
    const {email} = req.body;
    const user = await UserModel.findOne({email});
    let otp = generateOtp();
    if(user){
       console.log(otp);
      await UserModel.updateOne({email},{$set : {otp}});
    }
    else{
        return res.status(400).json({msg : "User not found"});
    }
    const token = jwt.sign({email},"Aniket",{expiresIn:"1h"});
    const resetPassLink = `yourDomain.com/reset-password?token=${token}`;
    const mailOptions = {
        from: "aniket357baghel@gmail.com",
        to: email,
        subject: "Otp verification",
        text: `Enter the otp to get validated : ${otp}`,
        html : `<p>Click<a href = "${resetPassLink}"></a>to continue</p>`
    }

    transporter.sendMail(mailOptions ,(err,info)=>{
        if(err){
            res.status(400).json({error : err});
            console.log(err);
        }
        else{
            res.status(200).send("Email sent : "+info.response);
            console.log("email sent "+info.response);
        }
    })
    }
    catch(err){
        console.log(err);
        res.status(500).send("internal server error");
    }
})

userRoute.post('/reset-password',async(req,res)=>{
    try{
    const {email,otp,newPassword} = req.body;
    const user = await UserModel.findOne({email});

    if(user && user.otp === otp){
        bcrypt.hash(newPassword, 5, async(err, hash)=> {
            if(err){
                res.status(200).json({error : err});
            }
            else{
               await UserModel.findByIdAndUpdate(user.id,{email,otp:null,newPassword:hash});
               res.status(200).json({msg: "password reset successfully"});
            }
        });
    }
} catch(err){
    res.status(400).json({error : err});
}
})

module.exports = { userRoute };
