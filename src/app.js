import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

//routes import 
import userRouter from './routes/user.routes.js'


//routes declaration
app.use("/api/v1/users",userRouter)// base path


export { app };






// Express framework - think of it as importing a toolkit that makes it easy to create web servers.
// CORS (Cross-Origin Resource Sharing) - a security feature that controls which websites can talk to your server.
//cookie parser- imports a tool that helps your server understand and work with cookies (small pieces of data stored in users' browsers).
//Raw cookies come to the server as one long string like: "sessionId=abc123; theme=dark; lang=en"
//Cookie-parser converts this into an easy-to-use format:
/* {
  sessionId: "abc123",
  theme: "dark", 
  lang: "en"
} */


  // CORS_ORIGIN is an environment variable (a setting stored outside your code) that contains the web address of the ONLY website you want to allow access to your server.

//app.use(express.json({ limit: "16kb" }));
//This lets your server understand JSON data (a common data format) sent by clients, but limits it to 16 kilobytes to prevent huge uploads that could slow down your server.

//app.use(express.static("public"));
//Static files are files that don't change or process - they're served exactly as they are stored on your server:
//Without static serving: Every time someone wants an image, they have to ask the cashier (server) to go to the back room, find it, and bring it to them.
//With static serving: You put commonly needed items in a display case(public folder) where customers can directly pick them up without bothering staff.
//These URLs become automatically available:
//http://yoursite.com/images/logo.png → serves public/images/logo.png