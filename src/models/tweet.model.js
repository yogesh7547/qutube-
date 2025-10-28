import mongoose,{mongo, Schema} from "mongoose";

const tweetSchema= new Schema({
   content:{
    type:String,
    required:true
   } 
},{timestamps:true})

export const Tweet= mongoose.model("Tweet",tweetSchema)