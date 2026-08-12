const mongoose = require("mongoose");


const ideaSchema = new mongoose.Schema(

    {

        /* ==========================================
                IDEA OWNER
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


        problem: {

            type:
                String,

            required:
                true,

            trim:
                true

        },


        solution: {

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


        audience: {

            type:
                String,

            required:
                true,

            trim:
                true

        },


        stage: {

            type:
                String,

            default:
                ""

        },


        priority: {

            type:
                String,

            default:
                ""

        },


        image: {

            type:
                String,

            default:
                ""

        },


        /* ==========================================
                SAVED IDEAS
        ========================================== */

        savedBy: [

            {

                type:
                    mongoose.Schema.Types.ObjectId,

                ref:
                    "User"

            }

        ]

    },


    /* ==========================================
            TIMESTAMPS
    ========================================== */

    {

        timestamps:
            true

    }

);


module.exports =
    mongoose.model(
        "Idea",
        ideaSchema
    );  