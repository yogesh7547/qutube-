import { Router } from "express";
import {createTweet, getUserTweets, updateTweet, deleteTweet} from "../controllers/tweet.controller.js"

import { verifyJWT } from "../middlewares/auth.middleware.js";
import { toggleTweetLike } from "../controllers/like.controller.js";

const router= Router()

router.use(verifyJWT)

router.route("/").post(createTweet)

//keep it in user.routes file
// router.route("/").get(getUserTweets)

router.route("/:tweetId").patch(updateTweet)

router.route("/:tweetId").delete(deleteTweet)

//like

router.route("/:tweetId/toggle-like").patch(toggleTweetLike)

export default router;