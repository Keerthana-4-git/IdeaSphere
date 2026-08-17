const express =
    require("express");


const router =
    express.Router();


const {

    getSavedExploreIdeas,

    saveExploreIdea,

    unsaveExploreIdea

} =
    require("../controllers/savedExploreController");


const authMiddleware =
    require("../middleware/authMiddleware");


/* ==========================================
        GET SAVED EXPLORE IDEAS
========================================== */

router.get(

    "/",

    authMiddleware,

    getSavedExploreIdeas

);


/* ==========================================
        SAVE EXPLORE IDEA
========================================== */

router.post(

    "/",

    authMiddleware,

    saveExploreIdea

);


/* ==========================================
        UNSAVE EXPLORE IDEA
========================================== */

router.delete(

    "/:exploreId",

    authMiddleware,

    unsaveExploreIdea

);


module.exports =
    router;