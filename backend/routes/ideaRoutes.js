const express = require("express");

const router = express.Router();


/* ==================================================
        IDEA CONTROLLERS
================================================== */

const {

    createIdea,

    getIdeas,

    getIdeaById,

    updateIdea,

    deleteIdea,

    saveIdea,

    unsaveIdea,

    getSavedIdeas

} = require("../controllers/ideaController");


/* ==================================================
        AUTH MIDDLEWARE
================================================== */

const authMiddleware =
    require("../middleware/authMiddleware");


/* ==================================================
        CREATE IDEA
================================================== */

router.post(

    "/",

    authMiddleware,

    createIdea

);


/* ==================================================
        GET ALL USER IDEAS
================================================== */

router.get(

    "/",

    authMiddleware,

    getIdeas

);


/* ==================================================
        GET SAVED IDEAS
================================================== */

router.get(

    "/saved",

    authMiddleware,

    getSavedIdeas

);


/* ==================================================
        SAVE IDEA
================================================== */

router.post(

    "/:id/save",

    authMiddleware,

    saveIdea

);


/* ==================================================
        UNSAVE IDEA
================================================== */

router.delete(

    "/:id/save",

    authMiddleware,

    unsaveIdea

);


/* ==================================================
        GET SINGLE IDEA
================================================== */

router.get(

    "/:id",

    authMiddleware,

    getIdeaById

);


/* ==================================================
        UPDATE IDEA
================================================== */

router.put(

    "/:id",

    authMiddleware,

    updateIdea

);


/* ==================================================
        DELETE IDEA
================================================== */

router.delete(

    "/:id",

    authMiddleware,

    deleteIdea

);


/* ==================================================
        EXPORT ROUTER
================================================== */

module.exports = router;