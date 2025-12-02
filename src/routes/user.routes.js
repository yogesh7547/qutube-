import {Router} from 'express';
import { loginUser, logoutUser, registerUser,refreshAccessToken, updateUserAvatar, changeCurrentPassword, getCurrentUser, updateAccountDetails, updateUserCoverImage, getUserChannelProfile, getWatchHistory } from '../controllers/user.controller.js';
import {upload} from '../middlewares/multer.middleware.js'
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { getUserTweets } from '../controllers/tweet.controller.js';
import { getAllVideos } from '../controllers/video.controller.js';
import { getUserPlaylists } from '../controllers/playlist.controller.js';


const router = Router()

router.route("/register").post(
    upload.fields([
        {
            name:"avatar",
            maxCount:1
        },
        {
            name:"coverImage",
            maxCount:1
        }
    ]),
    registerUser
)//Specific routes or endpoints

router.route("/login").post(loginUser)

//secured routes
router.route("/logout").post(verifyJWT, logoutUser)
router.route("/refresh-token").post(verifyJWT,refreshAccessToken)
router.route("/change-password").post(verifyJWT,changeCurrentPassword)
router.route("/current-user").get(verifyJWT,getCurrentUser)
router.route("/update-account").patch(verifyJWT,updateAccountDetails)
router.route("/change-password").post(verifyJWT,changeCurrentPassword)
router.route("/avatar").patch(verifyJWT,upload.single("avatar"), updateUserAvatar)


// router.route("/avatar").post(
//     upload.single("avatar"),
//     updateUserAvatar
// )

router.route("current-user").get(verifyJWT,getCurrentUser)
router.route("/cover-image").patch(verifyJWT,upload.single("coverImage"),updateUserCoverImage)
router.route("/c/:username").get(verifyJWT,getUserChannelProfile)
router.route("/history").get(verifyJWT,getWatchHistory)

//tweet 

router.route("/:userId/tweets").get(getUserTweets)

//video

router.route("/:userId/videos").get(getAllVideos)

//playlist

router.route("/:userId/playlists").get(getUserPlaylists)


export default router





