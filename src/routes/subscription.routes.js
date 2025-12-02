import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { getSubscribedChannels, getUserChannelSubscribers, toggleSubscription } from "../controllers/subscription.controller.js";

const router= Router()
router.use(verifyJWT)

router.route("/:channelId/toggle-subscription").patch(toggleSubscription)

router.route("/:channelId/subscribers").get(getUserChannelSubscribers)

router.route("/:subscriberId/subscriptions").get(getSubscribedChannels)


export default router;