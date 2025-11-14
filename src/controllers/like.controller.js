import mongoose, { isValidObjectId } from "mongoose";
import { Like } from "../models/like.model.js";
import { Video } from "../models/video.model.js";
import { Comment } from "../models/comment.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { Tweet } from "../models/tweet.model.js";


const toggleVideoLike = asyncHandler(async (req, res) => {
  //get the videoid
  //find the video from video model
  //find  the doc which is commom to videoid and userid of the requesting user - it will signify existing like
  //if like exists- delete he like doc for this user and decrease the no. of likes for the video from the video model
  // if it doesnt - create one like doc for the same and increase the no of likes for the video in video model

  const { videoId } = req.params;

  if(!isValidObjectId(videoId)){
      throw new ApiError(400, "invalid video Id")
    }

  const video = await Video.findById(videoId);

  if (!video) {
    throw new ApiError(404, "video file not found");
  }

  const existingLike = await Like.findOne({
    video: videoId,
    likedBy: req.user._id,
  });

  if (existingLike) {
    await existingLike.deleteOne();

    video.likes -= 1;

    await video.save();

    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Like removed from this video"));
  } else {
    const like = await Like.create({
      video: videoId,
      likedBy: req.user._id,
    });

    video.likes += 1;

    await video.save();

    const updatedLike = await like.populate("likedBy", "username avatar");

    return res
      .status(201)
      .json(
        new ApiResponse(201, { updatedLike }, "successfully liked the video")
      );
  }
});

const toggleCommentLike = asyncHandler(async (req, res) => {
  
  //TODO: toggle like on comment

  const {commentId}= req.params;

  if(!isValidObjectId(commentId)){
      throw new ApiError(400, "invalid comment Id")
    }

  const comment = await Comment.findById(commentId)

  if(!comment){
    throw new ApiError(404, "comment not found")
  }

  const existingLike= await Like.findOne({
    comment:commentId,
    likedBy:req.user._id
  })

  if(existingLike){
    await existingLike.deleteOne()
    comment.likes-=1;
    await comment.save()

    return res
    .status(200)
    .json(new ApiResponse(200, {}, "successfully deleted the like on comment"))
  }

  else{
    const like = await Like.create({
        comment:commentId,
        likedBy:req.user._id
    })

    comment.likes+=1;
    await comment.save()

    const populatedLike= await like.populate("likedBy", "username avatar")

    return res
    .status(200)
    .json(200, {populatedLike}, "successfully liked the comment")
  }

});

const toggleTweetLike = asyncHandler(async (req, res) => {
  
  //TODO: toggle like on tweet

  const { tweetId } = req.params;

  if(!isValidObjectId(tweetId)){
      throw new ApiError(400, "invalid tweet Id")
    }
  
  const tweet = await Tweet.findById(tweetId)

  if(!tweet){
    throw new ApiError(404, "tweet not found")
  }

  const existingLike= await Like.findOne({
    tweet:tweetId,
    likedBy:req.user._id
  })

  if(existingLike){
    await existingLike.deleteOne()
    tweet.likes-=1;
    await tweet.save()

    return res
    .status(200)
    .json(new ApiResponse(200, {}, "successfully removed like from tweet"))
  }

  else{
    const like = await Like.create({
        tweet:tweetId,
        likedBy:req.user._id
    })


    tweet.likes+=1;
    await tweet.save()

    const populatedLike= await like.populate("likedBy", "username avatar");

    return res
    .status(201)
    .json(201, {populatedLike}, "successfully liked the tweet")
  }

  
});

const getLikedVideos = asyncHandler(async (req, res) => {
  //TODO: get all liked videos
   
  //fetch all the liked videos from the Likes model- search for docs in likes model that have video(any) and likedBy(requesting user) 

  const likedVideoDocs=await Like.find({
    likedBy:req.user._id,
    video:{$exists:true}
  }).populate("video")

  const likedVideos=likedVideoDocs.map(likeDoc=>likeDoc.video)

  return res
  .status(200)
  .json(new ApiResponse(200, likedVideos, "successfully fetched all liked Videos"))
});

export { toggleCommentLike, toggleTweetLike, toggleVideoLike, getLikedVideos };
