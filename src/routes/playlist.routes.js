import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {createPlaylist,
  getUserPlaylists,
  getPlaylistById,
  addVideoToPlaylist,
  removeVideoFromPlaylist,
  deletePlaylist,
  updatePlaylist,} from "../controllers/playlist.controller.js"

  const router= Router()

  router.use(verifyJWT)

  router.route("/").post(createPlaylist)

 //put getUserPlaylist in user Routes 

  router.route("/:playlistId").get(getPlaylistById)

  router.route("/:playlistId/videos/:videoId").patch(addVideoToPlaylist)

  router.route("/:playlistId/videos/:videoId").delete(removeVideoFromPlaylist)

  router.route("/:playlistId").delete(deletePlaylist)

  router.route("/:playlistId").patch(updatePlaylist)

  



  export default router