// require('dotenv').config({path:'./env'})

import dotenv from "dotenv";


import connectDB from "./db/index.js";

dotenv.config({
  path: "./env", 
});


connectDB();



//dotenv is a package that loads environment variables from a .env file into your Node.js app


//dotenv.config() reads your .env file and loads those variables into memory so they're available as process.env.WHATEVER.
//you need to call it before any code (like connectDB function ) that tries to use those environment variables.


































/*
import express from 'express'
const app = express()


;(async()=>{
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        app.on("error",(error)=>{
            console.log("ERR:", error);
            throw error
        })

        app.listen(process.env.PORT, ()=>{
            console.log(`app is listening on port ${process.env.PORT}`);

        })
    } catch (error) {
        console.log("ERROR",error)
        throw err
    }
})()

*/
