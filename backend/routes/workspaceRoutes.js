const express = require("express");

const router = express.Router();

/* ==========================================
        WORKSPACE CONTROLLERS
========================================== */

const {
    createWorkspace,
    getWorkspaces,
    getWorkspaceById,
    updateWorkspace,
    deleteWorkspace
} = require("../controllers/workspaceController");

/* ==========================================
        AUTH MIDDLEWARE
========================================== */

const protect = require("../middleware/authMiddleware");

/* ==========================================
        CREATE WORKSPACE
========================================== */

router.post(
    "/",
    protect,
    createWorkspace
);

/* ==========================================
        GET USER WORKSPACES
========================================== */

router.get(
    "/",
    protect,
    getWorkspaces
);

/* ==========================================
        GET SINGLE WORKSPACE
========================================== */

router.get(
    "/:id",
    protect,
    getWorkspaceById
);

/* ==========================================
        UPDATE WORKSPACE
========================================== */

router.put(
    "/:id",
    protect,
    updateWorkspace
);

/* ==========================================
        DELETE WORKSPACE
========================================== */

router.delete(
    "/:id",
    protect,
    deleteWorkspace
);

/* ==========================================
        EXPORT ROUTER
========================================== */

module.exports = router;
