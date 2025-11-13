import mongoose from "mongoose";
import { Video } from "../models/video.model.js";
import { Subscription } from "../models/subscription.model.js";
import { Like } from "../models/like.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getChannelStats = asyncHandler(async (req, res) => {
  // TODO: Get the channel stats like total video views, total subscribers, total videos, total likes etc.

  const userId= req.user._id

  const SubscribersCountPromise= await Subscription.countDocuments({
    channel:userId
  })

  const videoStatsPromise= Video.aggregate([
    {
        $match:{
            owner:userId
        }
    },
    {
        $group:{
            _id:null,
            totalVideos:{$sum:1},
            totalLikes:{$sum:"$likes"},
            totalViews:{$sum:"$views"}
        }
    },

  ])

  const [SubscribersCount, videoStats]= await Promise.all([
    SubscribersCountPromise,
    videoStatsPromise
  ])

  const channelStats= {
    totalSubscribers:SubscribersCount || 0,
    totalLikes: videoStats[0]?.totalLikes || 0,
    totalVideos: videoStats[0]?.totalVideos || 0,
    totalViews: videoStats[0]?.totalViews || 0,
  }

  return res
  .status(200)
  .json(new ApiResponse(200, channelStats, "Channel stats fetched successfully"))

});

const getChannelVideos = asyncHandler(async (req, res) => {
  // TODO: Get all the videos uploaded by the channel
  const {page=1,limit=10}=req.query
  
  const myVideosAggregate= Video.aggregate([
    {
        $match:{
            owner:req.user._id
        }
    },
    {
        $sort:{
            createdAt:-1
        }
    }
  ])

  const options={
    page:parseInt(page),
    limit:parseInt(limit)
  }

  const myVideos= await Video.aggregatePaginate(myVideosAggregate,options)

  return res
  .status(200)
  .json(new ApiResponse(200,myVideos, "myVideos fetched successfully"))
});

export { getChannelStats, getChannelVideos };
