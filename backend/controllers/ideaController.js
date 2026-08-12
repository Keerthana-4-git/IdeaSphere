const Idea = require("../models/Idea");


/* ==========================================
        CREATE IDEA
========================================== */

const createIdea = async (req, res) => {

    try {

        const {
            title,
            problem,
            solution,
            category,
            audience,
            stage,
            priority,
            image
        } = req.body;


        /* ==========================================
                VALIDATION
        ========================================== */

        if (
            !title ||
            !problem ||
            !solution ||
            !audience
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Please fill in all required fields."

            });

        }


        /* ==========================================
                CREATE IDEA
        ========================================== */

        const idea = await Idea.create({

            user:
                req.user._id ||
                req.user.id,

            title,

            problem,

            solution,

            category:
                category || "",

            audience,

            stage:
                stage || "",

            priority:
                priority || "",

            image:
                image || ""

        });


        /* ==========================================
                SUCCESS
        ========================================== */

        res.status(201).json({

            success: true,

            message:
                "Idea created successfully!",

            idea

        });

    }

    catch (error) {

        console.error(
            "Create Idea Error:",
            error
        );


        res.status(500).json({

            success: false,

            message:
                "Failed to create idea."

        });

    }

};


/* ==========================================
        GET USER IDEAS
========================================== */

const getIdeas = async (req, res) => {

    try {

        const userId =
            req.user._id ||
            req.user.id;


        const ideas =
            await Idea.find({

                user: userId

            }).sort({

                createdAt: -1

            });


        res.status(200).json({

            success: true,

            ideas

        });

    }

    catch (error) {

        console.error(
            "Get Ideas Error:",
            error
        );


        res.status(500).json({

            success: false,

            message:
                "Failed to fetch ideas."

        });

    }

};


/* ==========================================
        GET SINGLE IDEA
========================================== */

const getIdeaById = async (req, res) => {

    try {

        const userId =
            req.user._id ||
            req.user.id;


        const idea =
            await Idea.findOne({

                _id:
                    req.params.id,

                user:
                    userId

            });


        /* ==========================================
                IDEA NOT FOUND
        ========================================== */

        if (!idea) {

            return res.status(404).json({

                success: false,

                message:
                    "Idea not found."

            });

        }


        /* ==========================================
                SUCCESS
        ========================================== */

        res.status(200).json({

            success: true,

            idea

        });

    }

    catch (error) {

        console.error(
            "Get Single Idea Error:",
            error
        );


        res.status(500).json({

            success: false,

            message:
                "Failed to fetch idea."

        });

    }

};


/* ==========================================
        UPDATE IDEA
========================================== */

const updateIdea = async (req, res) => {

    try {

        const userId =
            req.user._id ||
            req.user.id;


        const idea =
            await Idea.findOneAndUpdate(

                {

                    _id:
                        req.params.id,

                    user:
                        userId

                },

                {

                    $set:
                        req.body

                },

                {

                    new: true,

                    runValidators: true

                }

            );


        /* ==========================================
                IDEA NOT FOUND
        ========================================== */

        if (!idea) {

            return res.status(404).json({

                success: false,

                message:
                    "Idea not found."

            });

        }


        /* ==========================================
                SUCCESS
        ========================================== */

        res.status(200).json({

            success: true,

            message:
                "Idea updated successfully!",

            idea

        });

    }

    catch (error) {

        console.error(
            "Update Idea Error:",
            error
        );


        res.status(500).json({

            success: false,

            message:
                "Failed to update idea."

        });

    }

};


/* ==========================================
        DELETE IDEA
========================================== */

const deleteIdea = async (req, res) => {

    try {

        const userId =
            req.user._id ||
            req.user.id;


        const idea =
            await Idea.findOneAndDelete({

                _id:
                    req.params.id,

                user:
                    userId

            });


        /* ==========================================
                IDEA NOT FOUND
        ========================================== */

        if (!idea) {

            return res.status(404).json({

                success: false,

                message:
                    "Idea not found."

            });

        }


        /* ==========================================
                SUCCESS
        ========================================== */

        res.status(200).json({

            success: true,

            message:
                "Idea deleted successfully!"

        });

    }

    catch (error) {

        console.error(
            "Delete Idea Error:",
            error
        );


        res.status(500).json({

            success: false,

            message:
                "Failed to delete idea."

        });

    }

};


/* ==========================================
        SAVE IDEA
========================================== */

const saveIdea = async (req, res) => {

    try {

        const userId =
            req.user._id ||
            req.user.id;


        const idea =
            await Idea.findById(
                req.params.id
            );


        if (!idea) {

            return res.status(404).json({

                success: false,

                message:
                    "Idea not found."

            });

        }


        const alreadySaved =
            idea.savedBy.some(

                savedUserId =>
                    String(savedUserId) ===
                    String(userId)

            );


        if (!alreadySaved) {

            idea.savedBy.push(userId);

            await idea.save();

        }


        res.status(200).json({

            success: true,

            message:
                "Idea saved successfully.",

            saved: true,

            idea

        });

    }

    catch (error) {

        console.error(
            "Save Idea Error:",
            error
        );


        res.status(500).json({

            success: false,

            message:
                "Failed to save idea."

        });

    }

};


/* ==========================================
        UNSAVE IDEA
========================================== */

const unsaveIdea = async (req, res) => {

    try {

        const userId =
            req.user._id ||
            req.user.id;


        const idea =
            await Idea.findById(
                req.params.id
            );


        if (!idea) {

            return res.status(404).json({

                success: false,

                message:
                    "Idea not found."

            });

        }


        idea.savedBy =
            idea.savedBy.filter(

                savedUserId =>
                    String(savedUserId) !==
                    String(userId)

            );


        await idea.save();


        res.status(200).json({

            success: true,

            message:
                "Idea removed from saved ideas.",

            saved: false

        });

    }

    catch (error) {

        console.error(
            "Unsave Idea Error:",
            error
        );


        res.status(500).json({

            success: false,

            message:
                "Failed to remove saved idea."

        });

    }

};


/* ==========================================
        GET SAVED IDEAS
========================================== */

const getSavedIdeas = async (req, res) => {

    try {

        const userId =
            req.user._id ||
            req.user.id;


        const ideas =
            await Idea.find({

                savedBy: userId

            }).sort({

                createdAt: -1

            });


        res.status(200).json({

            success: true,

            ideas

        });

    }

    catch (error) {

        console.error(
            "Get Saved Ideas Error:",
            error
        );


        res.status(500).json({

            success: false,

            message:
                "Failed to fetch saved ideas."

        });

    }

};


/* ==========================================
        EXPORT ALL CONTROLLERS
========================================== */

module.exports = {

    createIdea,

    getIdeas,

    getIdeaById,

    updateIdea,

    deleteIdea,

    saveIdea,

    unsaveIdea,

    getSavedIdeas

};