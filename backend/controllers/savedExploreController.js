const SavedExploreIdea =
    require("../models/SavedExploreIdea");


/* ==========================================
        GET SAVED EXPLORE IDEAS
========================================== */

const getSavedExploreIdeas = async (req, res) => {

    try {

        const userId =
            req.user._id ||
            req.user.id;


        const ideas =
            await SavedExploreIdea.find({

                user:
                    userId

            }).sort({

                createdAt:
                    -1

            });


        res.status(200).json({

            success:
                true,

            ideas

        });

    }

    catch (error) {

        console.error(
            "Get Saved Explore Ideas Error:",
            error
        );


        res.status(500).json({

            success:
                false,

            message:
                "Failed to fetch saved Explore ideas."

        });

    }

};


/* ==========================================
        SAVE EXPLORE IDEA
========================================== */

const saveExploreIdea = async (req, res) => {

    try {

        const userId =
            req.user._id ||
            req.user.id;


        const {

            exploreId,
            title,
            category,
            stage,
            description,
            problem,
            solution,
            audience,
            tags

        } = req.body;


        if (!exploreId || !title) {

            return res.status(400).json({

                success:
                    false,

                message:
                    "Explore idea information is incomplete."

            });

        }


        const existingIdea =
            await SavedExploreIdea.findOne({

                user:
                    userId,

                exploreId

            });


        if (existingIdea) {

            return res.status(200).json({

                success:
                    true,

                message:
                    "Idea is already saved.",

                idea:
                    existingIdea,

                saved:
                    true

            });

        }


        const savedIdea =
            await SavedExploreIdea.create({

                user:
                    userId,

                exploreId,

                title,

                category:
                    category || "",

                stage:
                    stage || "",

                description:
                    description || "",

                problem:
                    problem || "",

                solution:
                    solution || "",

                audience:
                    audience || "",

                tags:
                    Array.isArray(tags)
                        ? tags
                        : []

            });


        res.status(201).json({

            success:
                true,

            message:
                "Explore idea saved successfully.",

            idea:
                savedIdea,

            saved:
                true

        });

    }

    catch (error) {

        console.error(
            "Save Explore Idea Error:",
            error
        );


        res.status(500).json({

            success:
                false,

            message:
                "Failed to save Explore idea."

        });

    }

};


/* ==========================================
        UNSAVE EXPLORE IDEA
========================================== */

const unsaveExploreIdea = async (req, res) => {

    try {

        const userId =
            req.user._id ||
            req.user.id;


        const exploreId =
            req.params.exploreId;


        const deletedIdea =
            await SavedExploreIdea.findOneAndDelete({

                user:
                    userId,

                exploreId

            });


        if (!deletedIdea) {

            return res.status(404).json({

                success:
                    false,

                message:
                    "Saved Explore idea not found."

            });

        }


        res.status(200).json({

            success:
                true,

            message:
                "Explore idea removed from saved ideas.",

            saved:
                false

        });

    }

    catch (error) {

        console.error(
            "Unsave Explore Idea Error:",
            error
        );


        res.status(500).json({

            success:
                false,

            message:
                "Failed to remove saved Explore idea."

        });

    }

};


module.exports = {

    getSavedExploreIdeas,

    saveExploreIdea,

    unsaveExploreIdea

};