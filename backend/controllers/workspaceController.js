const Workspace = require("../models/Workspace");


/* ==========================================
        CREATE WORKSPACE
========================================== */

const createWorkspace = async (req, res) => {

    try {

        const {
            name,
            description,
            category
        } = req.body;


        if (!name || !name.trim()) {

            return res.status(400).json({

                success: false,

                message: "Workspace name is required."

            });

        }


        const workspace = await Workspace.create({

            owner: req.user._id,

            name: name.trim(),

            description: description || "",

            category: category || "General"

        });


        res.status(201).json({

            success: true,

            message: "Workspace created successfully!",

            workspace

        });


    }

    catch (error) {

        console.error(
            "Create Workspace Error:",
            error
        );


        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};


/* ==========================================
        GET USER WORKSPACES
========================================== */

const getWorkspaces = async (req, res) => {

    try {

        const workspaces = await Workspace.find({

            owner: req.user._id

        }).sort({

            createdAt: -1

        });


        res.json({

            success: true,

            workspaces

        });


    }

    catch (error) {

        console.error(
            "Get Workspaces Error:",
            error
        );


        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};


/* ==========================================
        GET SINGLE WORKSPACE
========================================== */

const getWorkspaceById = async (req, res) => {

    try {

        const workspace = await Workspace.findOne({

            _id: req.params.id,

            owner: req.user._id

        });


        if (!workspace) {

            return res.status(404).json({

                success: false,

                message: "Workspace not found."

            });

        }


        res.json({

            success: true,

            workspace

        });


    }

    catch (error) {

        console.error(
            "Get Workspace Error:",
            error
        );


        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};


/* ==========================================
        UPDATE WORKSPACE
========================================== */

const updateWorkspace = async (req, res) => {

    try {

        const workspace = await Workspace.findOne({

            _id: req.params.id,

            owner: req.user._id

        });


        if (!workspace) {

            return res.status(404).json({

                success: false,

                message: "Workspace not found."

            });

        }


        const {

            name,
            description,
            category,
            members,
            tasks,
            notes,
            files,
            activity,
            discussions

        } = req.body;


        /* ==========================================
                BASIC DETAILS
        ========================================== */

        if (name !== undefined) {

            if (!name.trim()) {

                return res.status(400).json({

                    success: false,

                    message: "Workspace name cannot be empty."

                });

            }


            workspace.name = name.trim();

        }


        if (description !== undefined) {

            workspace.description = description;

        }


        if (category !== undefined) {

            workspace.category = category;

        }


        /* ==========================================
                WORKSPACE DATA
        ========================================== */

        if (Array.isArray(members)) {

            workspace.members = members;

        }


        if (Array.isArray(tasks)) {

            workspace.tasks = tasks;

        }


        if (Array.isArray(notes)) {

            workspace.notes = notes;

        }


        if (Array.isArray(files)) {

            workspace.files = files;

        }


        if (Array.isArray(activity)) {

            workspace.activity = activity;

        }


        if (Array.isArray(discussions)) {

            workspace.discussions = discussions;

        }


        await workspace.save();


        res.json({

            success: true,

            message: "Workspace updated successfully!",

            workspace

        });

    }

    catch (error) {

        console.error(
            "Update Workspace Error:",
            error
        );


        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};


/* ==========================================
        DELETE WORKSPACE
========================================== */

const deleteWorkspace = async (req, res) => {

    try {

        const workspace = await Workspace.findOneAndDelete({

            _id: req.params.id,

            owner: req.user._id

        });


        if (!workspace) {

            return res.status(404).json({

                success: false,

                message: "Workspace not found."

            });

        }


        res.json({

            success: true,

            message: "Workspace deleted successfully."

        });

    }

    catch (error) {

        console.error(
            "Delete Workspace Error:",
            error
        );


        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};


/* ==========================================
        EXPORT CONTROLLERS
========================================== */

module.exports = {

    createWorkspace,

    getWorkspaces,

    getWorkspaceById,

    updateWorkspace,

    deleteWorkspace

};