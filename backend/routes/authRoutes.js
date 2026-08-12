const express = require("express");

const router = express.Router();

const {
    registerUser,
    loginUser,
    forgotPassword,
    resetPassword
} = require("../controllers/authController");

const protect = require("../middleware/authMiddleware");


/* ==========================
        TEST
========================== */

router.get("/test", (req, res) => {

    res.json({

        success: true,

        message: "Auth route is working!"

    });

});


/* ==========================
        REGISTER
========================== */

router.post(
    "/register",
    registerUser
);


/* ==========================
        LOGIN
========================== */

router.post(
    "/login",
    loginUser
);

/* ==========================
FORGOT PASSWORD
========================== */

router.post(
    "/forgot-password",
    forgotPassword
);


/* ==========================
RESET PASSWORD
========================== */

router.post(
    "/reset-password",
    resetPassword
);


/* ==========================
        CURRENT USER
========================== */

router.get(
    "/me",
    protect,
    (req, res) => {

        res.json({

            success: true,

            user: req.user

        });

    }
);


module.exports = router;    