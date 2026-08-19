/* ==========================================
        IDEASPHERE BACKEND URL
========================================== */

const API_URL = "https://ideasphere-622p.onrender.com/api";


/* ==========================================
        REGISTER USER
========================================== */

async function registerUser(fullName, email, password) {

    try {

        const response =
            await fetch(
                `${API_URL}/auth/register`,
                {

                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({

                        fullName,

                        email,

                        password

                    })

                }
            );


        return await response.json();

    }

    catch (error) {

        console.error(
            "Register Error:",
            error
        );


        return {

            success: false,

            message:
                "Unable to connect to the server."

        };

    }

}


/* ==========================================
        LOGIN USER
========================================== */

async function loginUser(
    email,
    password
) {

    try {

        const response =
            await fetch(
                `${API_URL}/auth/login`,
                {

                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({

                        email,

                        password

                    })

                }
            );


        return await response.json();

    }

    catch (error) {

        console.error(
            "Login Error:",
            error
        );


        return {

            success: false,

            message:
                "Unable to connect to the server."

        };

    }

}


/* ==========================================
        GET CURRENT USER
========================================== */

async function getCurrentUser() {

    const token =
        localStorage.getItem(
            "ideasphereToken"
        );


    if (!token) {

        return {

            success: false,

            message:
                "Not authenticated."

        };

    }


    try {

        const response =
            await fetch(
                `${API_URL}/auth/me`,
                {

                    method: "GET",

                    headers: {

                        "Authorization":
                            `Bearer ${token}`

                    }

                }
            );


        return await response.json();

    }

    catch (error) {

        console.error(
            "Current User Error:",
            error
        );


        return {

            success: false,

            message:
                "Unable to connect to the server."

        };

    }

}


/* ==========================================
        UPDATE PROFILE
========================================== */

async function updateProfile(data) {

    const token =
        localStorage.getItem(
            "ideasphereToken"
        );


    if (!token) {

        return {

            success: false,

            message:
                "Not authenticated."

        };

    }


    try {

        const response =
            await fetch(
                `${API_URL}/auth/profile`,
                {

                    method: "PUT",

                    headers: {

                        "Content-Type":
                            "application/json",

                        "Authorization":
                            `Bearer ${token}`

                    },

                    body:
                        JSON.stringify(data)

                }
            );


        return await response.json();

    }

    catch (error) {

        console.error(
            "Update Profile Error:",
            error
        );


        return {

            success: false,

            message:
                "Unable to connect to the server."

        };

    }

}


/* ==========================================
        WORKSPACE API
========================================== */

async function getWorkspaces() {

    const token =
        localStorage.getItem(
            "ideasphereToken"
        );


    if (!token) {

        return {

            success: false,

            message:
                "Not authenticated."

        };

    }


    try {

        const response =
            await fetch(
                `${API_URL}/workspaces`,
                {

                    method: "GET",

                    headers: {

                        "Authorization":
                            `Bearer ${token}`

                    }

                }
            );


        return await response.json();

    }

    catch (error) {

        console.error(
            "Get Workspaces Error:",
            error
        );


        return {

            success: false,

            message:
                "Unable to connect to the server."

        };

    }

}


/* ==========================================
        IDEA API
========================================== */


/* ==========================================
        CREATE IDEA
========================================== */

async function createIdea(data) {

    const token =
        localStorage.getItem(
            "ideasphereToken"
        );


    if (!token) {

        return {

            success: false,

            message:
                "Not authenticated."

        };

    }


    try {

        const response =
            await fetch(
                `${API_URL}/ideas`,
                {

                    method: "POST",

                    headers: {

                        "Content-Type":
                            "application/json",

                        "Authorization":
                            `Bearer ${token}`

                    },

                    body:
                        JSON.stringify(data)

                }
            );


        return await response.json();

    }

    catch (error) {

        console.error(
            "Create Idea Error:",
            error
        );


        return {

            success: false,

            message:
                "Unable to connect to the server."

        };

    }

}


/* ==========================================
        GET USER IDEAS
========================================== */

async function getIdeas() {

    const token =
        localStorage.getItem(
            "ideasphereToken"
        );


    if (!token) {

        return {

            success: false,

            message:
                "Not authenticated."

        };

    }


    try {

        const response =
            await fetch(
                `${API_URL}/ideas`,
                {

                    method: "GET",

                    headers: {

                        "Authorization":
                            `Bearer ${token}`

                    }

                }
            );


        return await response.json();

    }

    catch (error) {

        console.error(
            "Get Ideas Error:",
            error
        );


        return {

            success: false,

            message:
                "Unable to connect to the server."

        };

    }

}


/* ==========================================
        GET SINGLE IDEA
========================================== */

async function getIdeaById(
    ideaId
) {

    const token =
        localStorage.getItem(
            "ideasphereToken"
        );


    if (!token) {

        return {

            success: false,

            message:
                "Not authenticated."

        };

    }


    try {

        const response =
            await fetch(
                `${API_URL}/ideas/${ideaId}`,
                {

                    method: "GET",

                    headers: {

                        "Authorization":
                            `Bearer ${token}`

                    }

                }
            );


        return await response.json();

    }

    catch (error) {

        console.error(
            "Get Idea Error:",
            error
        );


        return {

            success: false,

            message:
                "Unable to connect to the server."

        };

    }

}


/* ==========================================
        UPDATE IDEA
========================================== */

async function updateIdea(
    ideaId,
    data
) {

    const token =
        localStorage.getItem(
            "ideasphereToken"
        );


    if (!token) {

        return {

            success: false,

            message:
                "Not authenticated."

        };

    }


    try {

        const response =
            await fetch(
                `${API_URL}/ideas/${ideaId}`,
                {

                    method: "PUT",

                    headers: {

                        "Content-Type":
                            "application/json",

                        "Authorization":
                            `Bearer ${token}`

                    },

                    body:
                        JSON.stringify(data)

                }
            );


        return await response.json();

    }

    catch (error) {

        console.error(
            "Update Idea Error:",
            error
        );


        return {

            success: false,

            message:
                "Unable to connect to the server."

        };

    }

}


/* ==========================================
        DELETE IDEA
========================================== */

async function deleteIdea(
    ideaId
) {

    const token =
        localStorage.getItem(
            "ideasphereToken"
        );


    if (!token) {

        return {

            success: false,

            message:
                "Not authenticated."

        };

    }


    try {

        const response =
            await fetch(
                `${API_URL}/ideas/${ideaId}`,
                {

                    method: "DELETE",

                    headers: {

                        "Authorization":
                            `Bearer ${token}`

                    }

                }
            );


        return await response.json();

    }

    catch (error) {

        console.error(
            "Delete Idea Error:",
            error
        );


        return {

            success: false,

            message:
                "Unable to connect to the server."

        };

    }

}


/* ==========================================
        SAVE IDEA
========================================== */

async function saveIdea(
    ideaId
) {

    const token =
        localStorage.getItem(
            "ideasphereToken"
        );


    if (!token) {

        return {

            success: false,

            message:
                "Not authenticated."

        };

    }


    try {

        const response =
            await fetch(
                `${API_URL}/ideas/${ideaId}/save`,
                {

                    method: "POST",

                    headers: {

                        "Authorization":
                            `Bearer ${token}`

                    }

                }
            );


        return await response.json();

    }

    catch (error) {

        console.error(
            "Save Idea Error:",
            error
        );


        return {

            success: false,

            message:
                "Unable to connect to the server."

        };

    }

}


/* ==========================================
        UNSAVE IDEA
========================================== */

async function unsaveIdea(
    ideaId
) {

    const token =
        localStorage.getItem(
            "ideasphereToken"
        );


    if (!token) {

        return {

            success: false,

            message:
                "Not authenticated."

        };

    }


    try {

        const response =
            await fetch(
                `${API_URL}/ideas/${ideaId}/save`,
                {

                    method: "DELETE",

                    headers: {

                        "Authorization":
                            `Bearer ${token}`

                    }

                }
            );


        return await response.json();

    }

    catch (error) {

        console.error(
            "Unsave Idea Error:",
            error
        );


        return {

            success: false,

            message:
                "Unable to connect to the server."

        };

    }

}


/* ==========================================
        GET SAVED IDEAS
========================================== */

async function getSavedIdeas() {

    const token =
        localStorage.getItem(
            "ideasphereToken"
        );


    if (!token) {

        return {

            success: false,

            message:
                "Not authenticated."

        };

    }


    try {

        const response =
            await fetch(
                `${API_URL}/ideas/saved`,
                {

                    method: "GET",

                    headers: {

                        "Authorization":
                            `Bearer ${token}`

                    }

                }
            );


        return await response.json();

    }

    catch (error) {

        console.error(
            "Get Saved Ideas Error:",
            error
        );


        return {

            success: false,

            message:
                "Unable to connect to the server."

        };

    }

}


/* ==========================================
        SAVED EXPLORE IDEAS
========================================== */


/* ==========================================
        GET SAVED EXPLORE IDEAS
========================================== */

async function getSavedExploreIdeas() {

    const token =
        localStorage.getItem(
            "ideasphereToken"
        );


    if (!token) {

        return {

            success: false,

            message:
                "Not authenticated."

        };

    }


    try {

        const response =
            await fetch(
                `${API_URL}/explore-saved`,
                {

                    method: "GET",

                    headers: {

                        "Authorization":
                            `Bearer ${token}`

                    }

                }
            );


        return await response.json();

    }

    catch (error) {

        console.error(
            "Get Saved Explore Ideas Error:",
            error
        );


        return {

            success: false,

            message:
                "Unable to connect to the server."

        };

    }

}


/* ==========================================
        SAVE EXPLORE IDEA
========================================== */

async function saveExploreIdea(
    idea
) {

    const token =
        localStorage.getItem(
            "ideasphereToken"
        );


    if (!token) {

        return {

            success: false,

            message:
                "Not authenticated."

        };

    }


    try {

        const response =
            await fetch(
                `${API_URL}/explore-saved`,
                {

                    method: "POST",

                    headers: {

                        "Content-Type":
                            "application/json",

                        "Authorization":
                            `Bearer ${token}`

                    },

                    body:
                        JSON.stringify({

                            exploreId:
                                idea.id,

                            title:
                                idea.title,

                            category:
                                idea.category,

                            stage:
                                idea.stage,

                            description:
                                idea.description,

                            problem:
                                idea.problem,

                            solution:
                                idea.solution,

                            audience:
                                idea.audience,

                            tags:
                                idea.tags || []

                        })

                }
            );


        return await response.json();

    }

    catch (error) {

        console.error(
            "Save Explore Idea Error:",
            error
        );


        return {

            success: false,

            message:
                "Unable to connect to the server."

        };

    }

}


/* ==========================================
        UNSAVE EXPLORE IDEA
========================================== */

async function unsaveExploreIdea(
    exploreId
) {

    const token =
        localStorage.getItem(
            "ideasphereToken"
        );


    if (!token) {

        return {

            success: false,

            message:
                "Not authenticated."

        };

    }


    try {

        const response =
            await fetch(
                `${API_URL}/explore-saved/${encodeURIComponent(exploreId)}`,
                {

                    method: "DELETE",

                    headers: {

                        "Authorization":
                            `Bearer ${token}`

                    }

                }
            );


        return await response.json();

    }

    catch (error) {

        console.error(
            "Unsave Explore Idea Error:",
            error
        );


        return {

            success: false,

            message:
                "Unable to connect to the server."

        };

    }

}


/* ==========================================
        CREATE WORKSPACE
========================================== */

async function createWorkspace(
    data
) {

    const token =
        localStorage.getItem(
            "ideasphereToken"
        );


    try {

        const response =
            await fetch(
                `${API_URL}/workspaces`,
                {

                    method: "POST",

                    headers: {

                        "Content-Type":
                            "application/json",

                        "Authorization":
                            `Bearer ${token}`

                    },

                    body:
                        JSON.stringify(data)

                }
            );


        return await response.json();

    }

    catch (error) {

        console.error(
            "Create Workspace Error:",
            error
        );


        return {

            success: false,

            message:
                "Unable to connect to the server."

        };

    }

}


/* ==========================================
        UPDATE WORKSPACE
========================================== */

async function updateWorkspace(
    workspaceId,
    data
) {

    const token =
        localStorage.getItem(
            "ideasphereToken"
        );


    try {

        const response =
            await fetch(
                `${API_URL}/workspaces/${workspaceId}`,
                {

                    method: "PUT",

                    headers: {

                        "Content-Type":
                            "application/json",

                        "Authorization":
                            `Bearer ${token}`

                    },

                    body:
                        JSON.stringify(data)

                }
            );


        return await response.json();

    }

    catch (error) {

        console.error(
            "Update Workspace Error:",
            error
        );


        return {

            success: false,

            message:
                "Unable to connect to the server."

        };

    }

}


/* ==========================================
        DELETE WORKSPACE
========================================== */

async function deleteWorkspace(
    workspaceId
) {

    const token =
        localStorage.getItem(
            "ideasphereToken"
        );


    try {

        const response =
            await fetch(
                `${API_URL}/workspaces/${workspaceId}`,
                {

                    method: "DELETE",

                    headers: {

                        "Authorization":
                            `Bearer ${token}`

                    }

                }
            );


        return await response.json();

    }

    catch (error) {

        console.error(
            "Delete Workspace Error:",
            error
        );


        return {

            success: false,

            message:
                "Unable to connect to the server."

        };

    }

}


/* ==========================================
        INVITATION API
========================================== */

async function createInvitation(
    data
) {

    const token =
        localStorage.getItem(
            "ideasphereToken"
        );


    try {

        const response =
            await fetch(
                `${API_URL}/invitations`,
                {

                    method: "POST",

                    headers: {

                        "Content-Type":
                            "application/json",

                        "Authorization":
                            `Bearer ${token}`

                    },

                    body:
                        JSON.stringify(data)

                }
            );


        return await response.json();

    }

    catch (error) {

        console.error(
            "Create Invitation Error:",
            error
        );


        return {

            success: false,

            message:
                "Unable to connect to the server."

        };

    }

}


/* ==========================================
        GET WORKSPACE INVITATIONS
========================================== */

async function getWorkspaceInvitations(
    workspaceId
) {

    const token =
        localStorage.getItem(
            "ideasphereToken"
        );


    try {

        const response =
            await fetch(
                `${API_URL}/invitations/workspace/${workspaceId}`,
                {

                    method: "GET",

                    headers: {

                        "Authorization":
                            `Bearer ${token}`

                    }

                }
            );


        return await response.json();

    }

    catch (error) {

        console.error(
            "Get Invitations Error:",
            error
        );


        return {

            success: false,

            message:
                "Unable to connect to the server."

        };

    }

}
