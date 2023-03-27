const express =  require("express");
const { UserModel } = require("../models/users.models");
const UsreRouter = express.Router();
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")


UsreRouter.post("/register", async (req, res) => {
    const {name, email, gender, password, age, city, is_married} = req.body

    try {

        bcrypt.hash(password, 5, async (err, hash) => {
            console.log({password:hash})
            const user = new UserModel({name, email, gender, password:hash, age, city, is_married})
            await user.save();
            res.status(200).send({"msg": "Registration is Successfull!"})
        })

    } catch (error) {
        res.status(400).send({"msg" : error.message})  
    }
})


UsreRouter.post("/login", async(req, res) => {
    const {email, password} = req.body

    try {
        const UserData = await UserModel.find({email:email});
        console.log(UserData[0])
        
        if(UserData.length >= 0){
        bcrypt.compare(password, UserData[0].password, (err, result) => {
            if(result) {
                res.status(200).send({"msg" : "LoginSuccessful", "token" : jwt.sign({"userID" : UserData[0]._id}, 'masai')})
            } else {
                res.status(400).send({"msg" : "Login is UnSuccessfull. Wrong Credentials"})  
            }
        })
        }
    } catch (error) {
        res.status(400).send({"msg" : error.message})  
    }

})



module.exports = { UsreRouter };