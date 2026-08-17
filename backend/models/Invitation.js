const mongoose = require("mongoose");

const invitationSchema = new mongoose.Schema(
    {
        workspace: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Workspace",
            required: true
        },

        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        email: {
            type: String,
            required: true,
            lowercase: true,
            trim: true
        },

        role: {
            type: String,
            default: "Editor",
            trim: true
        },

        message: {
            type: String,
            default: ""
        },

        status: {
            type: String,
            enum: [
                "Pending",
                "Accepted",
                "Declined"
            ],
            default: "Pending"
        }
    },
    {
        timestamps: true
    }
);

module.exports =
    mongoose.model("Invitation", invitationSchema);