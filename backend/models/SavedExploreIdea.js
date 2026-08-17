const mongoose = require("mongoose");


const savedExploreIdeaSchema = new mongoose.Schema(

    {

        /* ==========================================
                USER WHO SAVED THE IDEA
        ========================================== */

        user: {

            type:
                mongoose.Schema.Types.ObjectId,

            ref:
                "User",

            required:
                true

        },


        /* ==========================================
                ORIGINAL EXPLORE IDEA ID
        ========================================== */

        exploreId: {

            type:
                String,

            required:
                true

        },


        /* ==========================================
                IDEA DETAILS
        ========================================== */

        title: {

            type:
                String,

            required:
                true,

            trim:
                true

        },


        category: {

            type:
                String,

            default:
                ""

        },


        stage: {

            type:
                String,

            default:
                ""

        },


        description: {

            type:
                String,

            default:
                ""

        },


        problem: {

            type:
                String,

            default:
                ""

        },


        solution: {

            type:
                String,

            default:
                ""

        },


        audience: {

            type:
                String,

            default:
                ""

        },


        tags: {

            type:
                [String],

            default:
                []

        }

    },

    {

        timestamps:
            true

    }

);


/* ==========================================
        PREVENT DUPLICATE SAVES
========================================== */

savedExploreIdeaSchema.index(

    {
        user: 1,
        exploreId: 1
    },

    {
        unique: true
    }

);


module.exports =
    mongoose.model(
        "SavedExploreIdea",
        savedExploreIdeaSchema
    );