import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";


const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        console.log(`\n MongoDB connected !! DB HOST : ${connectionInstance.connection.host}`);

    } catch (error) {
        console.log("MONGODB connnection Failed", error);
        process.exit(1)
        

    }
}


export default connectDB

// you never know how much time it will take to get connected to the database once the request is being sent , thats why you should always wrap you connection code inside try catch and make it an async call 


//process.exit(1) tells your Node.js app to completely shut down immediately. The 1 means "exit with an error code" (0 would mean successful exit).
/* But why shut down the entire app

   So you have two choices when DB connection fails:

Keep the app running - But every user request that needs data will fail
Shut down completely - Force the issue to be fixed before serving users

Most apps choose option 2 because:

It prevents serving a broken experience to users
It forces you (the developer) to fix the database issue immediately
It's cleaner than having random errors throughout your app


However, in production, you might want to implement retry logic instead - try connecting a few times before giving up completely.
 */


//`${process.env.MONGODB_URI}/${DB_NAME}`)
/*
Why do people add the database name to the connection string?

Convenience - One place to define which database to use
Clarity - Makes it obvious which database your app is targeting
Organization - Especially if you have multiple databases on the same MongoDB server
 */


//console.log(`\n MongoDB connected !! DB HOST : ${connectionInstance.connection.host}`);
/*
You know exactly where your data is going:
Might print: "MongoDB connected !! DB HOST : localhost:27017"
Or: "MongoDB connected !! DB HOST : cluster0.abc123.mongodb.net"

 */