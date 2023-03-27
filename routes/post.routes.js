const express = require("express");

const { PostModel } = require("../models/posts.model");
const postRouter = express.Router()
const jwt = require("jsonwebtoken")


postRouter.get("/", async (req, res) => {
    
    const token = req.headers.authorization
    const decoded = jwt.verify(token, 'masai')
    console.log(decoded)
    const query  = req.query

    try { 
        if(decoded){
            const postData = await PostModel.find({"userID": decoded.userID})
            res.status(200).send(postData)
        }
    } catch (error) {
        res.status(400).send({"msg": error.message})
    }
})



postRouter.get("/top", async(req, res) => {
    const token = req.headers.authorization
    const decoded = jwt.verify(token, 'masai')
    const query  = req.query.no_of_comments
    try {
        if(decoded){
            const postData = await PostModel.find({"userID": decoded.userID},query).limit(3)
            res.status(200).send(postData)
        } 
    } catch (error) {
        res.status(400).send({"msg": error.message}) 
    }
})


postRouter.post("/add", async (req, res) => {
     const payload = req.body
    try {
        const post = new PostModel(payload) 
        await post.save()
        res.status(200).send({"msg" : "New Post Has Been Added"})
    } catch (error) {
        res.status(400).send({"msg": error.message})
    }
    
})

postRouter.patch("/update/:postID", async (req, res) => {

    const {postID} = req.params
    const payload = req.body
    const token =  req.headers.authorization
    const decoded = jwt.verify(token, 'masai')
    const req_id = decoded.userID
    const post = await PostModel.find({_id: postID})
    const userID_in_post = post[0].userID


    try {
        if(req_id === userID_in_post){
            const post = await PostModel.findByIdAndUpdate({_id:postID}, payload)
            res.status(200).send({"msg" : `Post with id:${postID} has been Updated`})
        } else {
            res.status(401).send({"msg": "You are not the owner of this post"})
        }
    } catch (error) {
        res.status(400).send({"msg" : error.message})
    }
})



postRouter.delete("/delete/:postID", async (req, res) => {
    const {postID} = req.params
    const token =  req.headers.authorization
    const decoded = jwt.verify(token, 'masai')
    const req_id = decoded.userID
    const post = await PostModel.findByIdAndRemove({_id: postID})
    const userID_in_post = post[0].userID

    try {
        if(req_id ===  userID_in_post){
            const postDeleted = await PostModel.findByIdAndDelete({_id:postID})
            res.status(200).send({"msg" : `Post with id:${postID} has been Deleted`})
        } else {
            res.status(401).send({"msg": "You are not the owner of this post"})
        }
    } catch (error) {
        res.status(400).send({"msg" : error.message})  
    }
})


module.exports = { postRouter }