import mongoose from "mongoose";
import { Comment } from "../models/comment.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Video } from "../models/video.model.js";

const getVideoComments = asyncHandler(async (req, res) => {
  //TODO: get all comments for a video
  const { videoId } = req.params;
  const { page = 1, limit = 10 } = req.query;

  if(!mongoose.isValidObjectId(videoId)){
    throw new ApiError(400, "invalid video Id")
  }

  const video = await Video.findById(videoId);

  if (!video) {
    throw new ApiError(404, "Video file not found");
  }

  const commentAggregate = Comment.aggregate([
    {
      $match: {
        video: new mongoose.Types.ObjectId(videoId),
      },
    },
    {
      $sort: {
        createdAt: -1,
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "owner",
        pipeline: [
          {
            $project: {
              username: 1,
              avatar: 1,
            },
          },
        ],
      },
    },
    {
      $addFields: {
        owner: {
          $first: "$owner",
        },
      },
    },
  ]);

  const options = {
    page: parseInt(page, 10),
    limit: parseInt(limit, 10),
  };

  const comments = await Comment.aggregatePaginate(commentAggregate, options);

  return res
    .status(200)
    .json(
      new ApiResponse(200, comments, "video comments fetched successfully")
    );
});

const addComment = asyncHandler(async (req, res) => {
  // TODO: add a comment to a video

  const { content } = req.body;
  const { videoId } = req.params;

  if(!mongoose.isValidObjectId(videoId)){
    throw new ApiError(400, "invalid video Id")
  }

  if (!content || !content.trim()) {
    throw new ApiError(400, "content should not be empty");
  }

  const video = await Video.findById(videoId);

  if (!video) {
    throw new ApiError(400, "video not found");
  }

  
    const comment = await Comment.create({
      content: content,
      owner: req.user?._id,
      video: videoId,
    });

    const populatedComment = await comment.populate("owner", "username avatar");

    return res
    .status(200)
    .json(new ApiResponse(200, populatedComment, "Comment added successfully"))
 
});

const updateComment = asyncHandler(async (req, res) => {
  // TODO: update a comment

  
  const {newContent}= req.body
  const {commenId}=req.params;

  if(!mongoose.isValidObjectId(commenId)){
    throw new ApiError(400, "invalid comment Id")
  }

  if(!newContent||!newContent.trim()){
    throw new ApiError(400, "content cannot be empty")
  }

  const comment = await Comment.findById(commenId)

  if(!comment){
    throw new ApiError(400, "comment not found")
  }

  comment.content=newContent;

  const updatedComment= await comment.save()

  return res
  .status(200)
  .json(new ApiResponse(200, updateComment, "updated the comment successfully"))
});

const deleteComment = asyncHandler(async (req, res) => {
  // TODO: delete a comment

  const {commenId}= req.params;

  if(!mongoose.isValidObjectId(commenId)){
    throw new ApiError(400, "invalid comment Id")
  }

  const comment= await Comment.findById(commenId)


  await comment.deleteOne()

  return res
  .status(200)
  .json(new ApiResponse(200, {}, "deleted the comment successfully"))

});

export { getVideoComments, addComment, updateComment, deleteComment };
