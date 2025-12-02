import mongoose, {isValidObjectId} from "mongoose"
import {User} from "../models/user.model.js"
import { Subscription } from "../models/subscription.model.js"
import {ApiError} from "../util/ApiError.js"
import {ApiResponse} from "../util/ApiResponse.js"
import {asyncHandler} from "../util/asyncHandler.js"



const toggleSubscription = asyncHandler(async (req, res) => { 
    const {channelId} = req.params
    // TODO: toggle subscription

    if(!isValidObjectId(channelId)){
        throw new ApiError(400, "invalid channel Id");
    }

    const channel=await User.findById(channelId)

    if(!channel){
        throw new ApiError(404, "Channel not found")
    }

    const existingSubscription= await Subscription.findOne({
        subscriber:req.user._id,
        channel:channelId
    })

    if(existingSubscription){

        await existingSubscription.deleteOne()
        
        return res
        .status(200)
        .json(new ApiResponse(200, {}, "Subscription removed for this channel"))
    }else{
        const subscription = await Subscription.create({
        subscriber:req.user._id,
        channel:channelId
    })

    const populatedSubscription= await subscription.populate("subscriber", "username avatar")

    return res
    .status(200)
    .json(new ApiResponse(200, populatedSubscription, "Subscription added for this channel"))
    


    }

})

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const {channelId} = req.params

    if(!isValidObjectId(channelId)){
        throw new ApiError(400, "invalid channel Id")
    }

    const subscribers= await Subscription.find({
        channel:channelId
    })

    return res
    .status(200)
    .json(new ApiResponse(200, subscribers, "subscribers list for channel fetched successfully"))
})

// controller to return channel list to which user has subscribed
const getSubscribedChannels= asyncHandler(async (req, res) => {
    const { subscriberId } = req.params

    if(!isValidObjectId(subscriberId)){
        throw new ApiError(400, "invalid subscriber Id")
    }

    
    const subscribedChannels= await Subscription.aggregate([
        {
            $match:{
                subscriber:new mongoose.Types.ObjectId(subscriberId)
            }
        },
        {
            $lookup:{
                from:"users",
                localField:"channel",
                foreignField:"_id",
                as:"subscribedChannel",
                pipeline:[
                    {
                        $project:{
                            username:1,
                            avatar:1
                        }
                    }
                ]

            }
        },
        {
            $addFields:{
                subscribedChannel:{
                    $first:"$subscribedChannel"
                }
            }
        },
        {
            $replaceRoot:{
                newRoot:"$subscribedChannel"
            }
        }
    ])
    return res
    .status(200)
    .json(new ApiResponse(200, subscribedChannels, "subscribed Channels found successfully"))
})

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}