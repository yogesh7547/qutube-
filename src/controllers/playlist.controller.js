import mongoose, { isValidObjectId } from "mongoose";
import { User } from "../models/user.model.js";
import { Playlist } from "../models/playlist.model.js";
import { ApiError } from "../util/ApiError.js";
import { ApiResponse } from "../util/ApiResponse.js";
import { asyncHandler } from "../util/asyncHandler.js";
import { Video } from "../models/video.model.js";

const createPlaylist = asyncHandler(async (req, res) => {
  const { name, description } = req.body;

  //TODO: create playlist

  if (!name || !name.trim()) {
    throw new ApiError(400, "playlist name cannot be empty");
  }

  if (!description || !description.trim()) {
    throw new ApiError(400, "playlist description cannot be empty");
  }

  const playlist = await Playlist.create({
    name: name,
    description: description,
    owner: req.user._id,
  });

  if (!playlist) {
    throw new ApiError(500, "failed to create playlist");
  }

  const populatedPlaylist = await playlist.populate("owner", "username avatar");

  return res
    .status(201)
    .json(
      new ApiResponse(201, populatedPlaylist, "playlist created successfully")
    );
});

const getUserPlaylists = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  //TODO: get user playlists

  if (!isValidObjectId(userId)) {
    throw new ApiError(400, "invalid user Id");
  }

  const user = await User.findById(userId).select("username avatar");

  if (!user) {
    throw new ApiError(404, "user not found");
  }

  const playlists = await Playlist.find({
    owner: userId,
  }).sort({ createdAt: -1 });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { user, playlists },
        "user's playlists fetched successfully"
      )
    );
});

const getPlaylistById = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  //TODO: get playlist by id

  if (!isValidObjectId(playlistId)) {
    throw new ApiError(400, "invalid playlist id");
  }

  const playlist = await Playlist.findById(playlistId);

  if (!playlist) {
    throw new ApiError(404, "playlist not found");
  }

  const populatedPlaylist = await playlist
    .populate({
      path: "owner",
      select: "username avatar", //gives owner's playlist details
    })
    .populate({
      path: "video", //populate the video array in the playlist
      select: "title description duration views likes", // gives video details
      populate: {
        //nested populate
        path: "owner",
        select: "username avatar", // gives the owner details for each video
      },
    });

  return res
    .status(200)
    .json(
      new ApiResponse(200, populatedPlaylist, "playlist fetched successfully")
    );
});

const addVideoToPlaylist = asyncHandler(async (req, res) => {
  const { playlistId, videoId } = req.params;

  if (!isValidObjectId(playlistId)) {
    throw new ApiError(400, "Invalid Playlist Id");
  }
  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid Video Id");
  }

  const playlist = await Playlist.findById(playlistId);
  if (!playlist) {
    throw new ApiError(404, "playlist not found");
  }

  const video = await Video.findById(videoId);
  if (!video) {
    throw new ApiError(404, "video not found");
  }

  if (playlist.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "you are not authorized to add videos to playlist");
  }

  if (playlist.video.includes(videoId)) {
    return res
      .status(200)
      .json(
        new ApiResponse(200, playlist, "video already exists in the playlist")
      );
  }

  playlist.video.push(videoId);

  const updatedPlaylist = await playlist.save();

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        updatedPlaylist,
        "video added to playlist successfully"
      )
    );
});

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
  const { playlistId, videoId } = req.params;
  // TODO: remove video from playlist

  if (!isValidObjectId(playlistId)) {
    throw new ApiError(400, "Invalid Playlist Id");
  }
  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid Video Id");
  }

  const playlist = await Playlist.findById(playlistId);
  if (!playlist) {
    throw new ApiError(404, "playlist not found");
  }

  const video = await Video.findById(videoId);
  if (!video) {
    throw new ApiError(404, "video not found");
  }

  if (playlist.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "you are not authorized to remove videos from this playlist");
  }

  if (!playlist.video.includes(videoId)) {
    throw new ApiError(400, "video doesn't exist in the playlist");
  }

  playlist.video.pull(videoId);

  await playlist.save();
  return res
    .status(200)
    .json(
      new ApiResponse(200, playlist, "video removed from playlist successfully")
    );
});

const deletePlaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  // TODO: delete playlist

  if (!isValidObjectId(playlistId)) {
    throw new ApiError(400, "invalid playlist Id");
  }

  const playlist = await Playlist.findById(playlistId);

  if (!playlist) {
    throw new ApiError(404, "playlist not found");
  }

  if (playlist.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "you are not authorized to delete this playlist");
  }

  await playlist.deleteOne();

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "deleted the playlist successfully"));
});

const updatePlaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  const { name, description } = req.body;
  //TODO: update playlist

  if (!name || !name.trim()) {
    throw new ApiError(400, "name cannot be empty");
  }
  if (!description || !description.trim()) {
    throw new ApiError(400, "description cannot be empty");
  }

  if (!isValidObjectId(playlistId)) {
    throw new ApiError(400, "invalid playlist Id");
  }

  const playlist = await Playlist.findById(playlistId);

  if (!playlist) {
    throw new ApiError(404, "playlist not found");
  }

  if (playlist.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "you are not authorized to update the details in this playlist");
  }

  playlist.name = name;
  playlist.description = description;

  const updatedPlaylist = await playlist.save();

  return res
    .status(200)
    .json(
      new ApiResponse(200, updatedPlaylist, "updated the playlist successfully")
    );
});

export {
  createPlaylist,
  getUserPlaylists,
  getPlaylistById,
  addVideoToPlaylist,
  removeVideoFromPlaylist,
  deletePlaylist,
  updatePlaylist,
};
