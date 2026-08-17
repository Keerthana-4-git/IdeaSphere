const express = require("express");

const router = express.Router();

const {
    createInvitation,
    getWorkspaceInvitations
} =
    require("../controllers/invitationController");

const protect =
    require("../middleware/authMiddleware");


router.post(
    "/",
    protect,
    createInvitation
);


router.get(
    "/workspace/:workspaceId",
    protect,
    getWorkspaceInvitations
);


module.exports = router;