import {Router} from "express"
import {getVideoComments, addComment, updateComment, deleteComment} from "../controllers/comment.controller.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"
import { toggleCommentLike } from "../controllers/like.controller.js"

const router=Router()
router.use(verifyJWT)

//keep getVideoComments and addComments in videoRoutes file

router.route("/:commentId").patch(updateComment)

router.route("/:commentId").delete(deleteComment)

//like

router.route("/:commentId/toggle-like").patch(toggleCommentLike)

export default router