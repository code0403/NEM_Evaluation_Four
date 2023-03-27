const express = require("express");
const dotenv = require("dotenv")
dotenv.config()
const { connection } = require("./config/db");
const { UsreRouter } = require("./routes/user.routes");
const { auth } = require("./middleware/authentication");
const { postRouter } = require("./routes/post.routes");

const app  = express()
app.use(express.json()) // middlewares

app.use("/users", UsreRouter)

app.use(auth) // middleware
app.use("/posts", postRouter)


app.listen(process.env.PORT, async () => {

    try {
        await connection
       console.log(`Connected to MongoDb`) 
    } catch (error) {
      console.log(error)
      console.log('Cannot Connect to MongoDb')  
    }

    console.log(`Server is Running at ${process.env.PORT}`)
})