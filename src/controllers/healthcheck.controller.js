import mongoose from "mongoose"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


const healthcheck = asyncHandler(async (req, res) => {
    //TODO: build a healthcheck response that checks that databse connection and the servers uptime

    const databaseStatus = mongoose.connection.readyState===1?"Database connected":"Database Disconnected"
    
    const ServerUptime= `${process.uptime().toFixed(2)} seconds`
     
    let message= "Health Check Passed"

    if(mongoose.connection.readyState!==1){
        message+="but the Database connection is established properly"
    }

    return res
    .status(200)
    .json(new ApiResponse(200, {databaseStatus,ServerUptime}, message))
})

export {
    healthcheck
    }
    