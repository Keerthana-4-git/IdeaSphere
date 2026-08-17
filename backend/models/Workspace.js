const mongoose = require("mongoose");

/* ==========================================
        WORKSPACE SUB-SCHEMAS
========================================== */

const memberSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },

        role: {
            type: String,
            default: "Collaborator",
            trim: true
        }
    },
    {
        _id: true
    }
);

const taskSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true
        },

        description: {
            type: String,
            default: "",
            trim: true
        },

        status: {
            type: String,
            default: "Pending",
            trim: true
        },

        createdAt: {
            type: Date,
            default: Date.now
        }
    },
    {
        _id: true
    }
);

const noteSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true
        },

        content: {
            type: String,
            default: ""
        },

        createdAt: {
            type: Date,
            default: Date.now
        }
    },
    {
        _id: true
    }
);

const fileSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },

        size: {
            type: Number,
            default: 0
        },

        createdAt: {
            type: Date,
            default: Date.now
        }
    },
    {
        _id: true
    }
);

const activitySchema = new mongoose.Schema(
    {
        text: {
            type: String,
            required: true,
            trim: true
        },

        createdAt: {
            type: Date,
            default: Date.now
        }
    },
    {
        _id: true
    }
);

const discussionSchema = new mongoose.Schema(
    {
        user: {
            type: String,
            required: true,
            trim: true
        },

        text: {
            type: String,
            required: true,
            trim: true
        },

        time: {
            type: Date,
            default: Date.now
        }
    },
    {
        _id: true
    }
);

/* ==========================================
        WORKSPACE SCHEMA
========================================== */

const workspaceSchema = new mongoose.Schema(
    {
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        name: {
            type: String,
            required: true,
            trim: true
        },

        description: {
            type: String,
            default: "",
            trim: true
        },

        category: {
            type: String,
            default: "General",
            trim: true
        },

        members: {
            type: [memberSchema],
            default: []
        },

        tasks: {
            type: [taskSchema],
            default: []
        },

        notes: {
            type: [noteSchema],
            default: []
        },

        files: {
            type: [fileSchema],
            default: []
        },

        activity: {
            type: [activitySchema],
            default: []
        },

        discussions: {
            type: [discussionSchema],
            default: []
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model(
    "Workspace",
    workspaceSchema
);