const Invitation =
    require("../models/Invitation");

const Workspace =
    require("../models/Workspace");


/* ==========================================
        CREATE INVITATION
========================================== */

const createInvitation = async (req, res) => {

    try {

        const {
            workspaceId,
            email,
            role,
            message
        } = req.body;


        if (!workspaceId || !email) {

            return res.status(400).json({

                success: false,

                message:
                    "Workspace and email are required."

            });

        }


        const workspace =
            await Workspace.findOne({

                _id: workspaceId,

                owner: req.user._id

            });


        if (!workspace) {

            return res.status(404).json({

                success: false,

                message:
                    "Workspace not found."

            });

        }


        const normalizedEmail =
            email.trim().toLowerCase();


        const existing =
            await Invitation.findOne({

                workspace: workspaceId,

                email: normalizedEmail,

                status: "Pending"

            });


        if (existing) {

            return res.status(400).json({

                success: false,

                message:
                    "This email has already been invited."

            });

        }


        const invitation =
            await Invitation.create({

                workspace: workspaceId,

                sender: req.user._id,

                email: normalizedEmail,

                role: role || "Editor",

                message: message || ""

            });


        res.status(201).json({

            success: true,

            message:
                "Invitation sent successfully!",

            invitation

        });

    }

    catch (error) {

        console.error(
            "Create Invitation Error:",
            error
        );

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};


/* ==========================================
        GET WORKSPACE INVITATIONS
========================================== */

const getWorkspaceInvitations =
    async (req, res) => {

        try {

            const workspace =
                await Workspace.findOne({

                    _id: req.params.workspaceId,

                    owner: req.user._id

                });


            if (!workspace) {

                return res.status(404).json({

                    success: false,

                    message:
                        "Workspace not found."

                });

            }


            const invitations =
                await Invitation.find({

                    workspace:
                        req.params.workspaceId

                }).sort({

                    createdAt: -1

                });


            res.json({

                success: true,

                invitations

            });

        }

        catch (error) {

            console.error(
                "Get Invitations Error:",
                error
            );

            res.status(500).json({

                success: false,

                message: error.message

            });

        }

    };


module.exports = {

    createInvitation,

    getWorkspaceInvitations

};