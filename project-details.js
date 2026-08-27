/* ==================================================
        IDEASPHERE - PROJECT DETAILS
================================================== */


/* ==================================================
        LOAD SELECTED IDEA ID
================================================== */

const selectedIdeaId =
    localStorage.getItem("selectedIdeaId");


/* ==================================================
        CHECK SELECTED IDEA
================================================== */

if (!selectedIdeaId) {

    alert("Project not found!");

    window.location.href = "home.html";

}


/* ==================================================
        GLOBAL IDEA
================================================== */

let idea = null;


/* ==================================================
        LOAD IDEA FROM MONGODB
================================================== */

async function loadIdea() {

    try {

        const token =
            localStorage.getItem("ideasphereToken");


        if (!token) {

            alert("⚠️ Please login first.");

            window.location.href =
                "login.html";

            return;

        }


        const response = await fetch(

            `https://ideasphere-622p.onrender.com/api/ideas/${selectedIdeaId}`,

            {

                method: "GET",

                headers: {

                    "Authorization":
                        "Bearer " + token

                }

            }

        );


        const data =
            await response.json();


        console.log(
            "Project Details:",
            data
        );


        /* ==================================================
                HANDLE API ERROR
        ================================================== */

        if (!response.ok || !data.success) {

            alert(
                "⚠️ " +
                (
                    data.message ||
                    "Project not found!"
                )
            );

            window.location.href =
                "home.html";

            return;

        }


        /* ==================================================
                STORE IDEA
        ================================================== */

        idea = data.idea;


        /* ==================================================
                DISPLAY PROJECT DETAILS
        ================================================== */

        displayIdea();


        /* ==================================================
                UPDATE SAVE BUTTON
        ================================================== */

        await updateSaveButton();

    }

    catch (error) {

        console.error(
            "Load Project Error:",
            error
        );

        alert(
            "⚠️ Unable to connect to the server."
        );

        window.location.href =
            "home.html";

    }

}


/* ==================================================
        DISPLAY IDEA
================================================== */

function displayIdea() {

    if (!idea) {

        return;

    }


    const projectTitle =
        document.getElementById(
            "projectTitle"
        );

    const category =
        document.getElementById(
            "category"
        );

    const priority =
        document.getElementById(
            "priority"
        );

    const stage =
        document.getElementById(
            "stage"
        );

    const problemText =
        document.getElementById(
            "problemText"
        );

    const solutionText =
        document.getElementById(
            "solutionText"
        );

    const audienceText =
        document.getElementById(
            "audienceText"
        );

    const createdDate =
        document.getElementById(
            "createdDate"
        );


    if (projectTitle) {

        projectTitle.textContent =
            idea.title ||
            "Untitled Idea";

    }


    if (category) {

        category.textContent =
            idea.category ||
            "General";

    }


    if (priority) {

        priority.textContent =
            (idea.priority ||
            "Medium") +
            " Priority";

    }


    if (stage) {

        stage.textContent =
            idea.stage ||
            "Idea";

    }


    if (problemText) {

        problemText.textContent =
            idea.problem ||
            "No problem statement available.";

    }


    if (solutionText) {

        solutionText.textContent =
            idea.solution ||
            "No solution description available.";

    }


    if (audienceText) {

        audienceText.textContent =
            idea.audience ||
            "Not specified";

    }


    if (createdDate) {

        createdDate.textContent =
            formatDate(
                idea.createdAt
            );

    }

}


/* ==================================================
        FORMAT DATE
================================================== */

function formatDate(date) {

    if (!date) {

        return "Not available";

    }


    const formattedDate =
        new Date(date);


    if (
        isNaN(
            formattedDate.getTime()
        )
    ) {

        return String(date);

    }


    return formattedDate.toLocaleDateString(

        "en-IN",

        {

            day: "numeric",

            month: "long",

            year: "numeric"

        }

    );

}


/* ==================================================
        EDIT IDEA
================================================== */

const editBtn =
    document.getElementById(
        "editBtn"
    );


if (editBtn) {

    editBtn.addEventListener(
        "click",
        function () {

            /*
                Keep the MongoDB idea ID.

                create-idea.js will use this ID
                to fetch the actual idea.
            */

            if (!selectedIdeaId) {

                alert(
                    "⚠️ Unable to identify this idea."
                );

                return;

            }


            localStorage.setItem(
                "selectedIdeaId",
                String(selectedIdeaId)
            );


            localStorage.setItem(
                "editMode",
                "true"
            );


            window.location.href =
                "create-idea.html";

        }
    );

}


/* ==================================================
        SAVE BUTTON ELEMENTS
================================================== */

const saveBtn =
    document.getElementById(
        "saveBtn"
    );


const saveIcon =
    document.getElementById(
        "saveIcon"
    );


const saveText =
    document.getElementById(
        "saveText"
    );


/* ==================================================
        CHECK IF IDEA IS SAVED
================================================== */

async function isIdeaSaved() {

    const token =
        localStorage.getItem(
            "ideasphereToken"
        );


    if (
        !token ||
        !selectedIdeaId
    ) {

        return false;

    }


    try {

        const response =
            await fetch(

                "https://ideasphere-622p.onrender.com/api/ideas/saved",

                {

                    method: "GET",

                    headers: {

                        "Authorization":
                            "Bearer " + token

                    }

                }

            );


        const data =
            await response.json();


        console.log(
            "Saved Ideas Check:",
            data
        );


        if (
            !response.ok ||
            !data.success
        ) {

            return false;

        }


        const savedIdeas =
            Array.isArray(data.ideas)
                ? data.ideas
                : [];


        return savedIdeas.some(

            savedIdea => {

                const savedId =
                    savedIdea._id ||
                    savedIdea.id;


                return String(savedId) ===
                    String(selectedIdeaId);

            }

        );

    }

    catch (error) {

        console.error(
            "Check Saved Idea Error:",
            error
        );


        return false;

    }

}


/* ==================================================
        UPDATE SAVE BUTTON
================================================== */

async function updateSaveButton() {

    if (!saveBtn) {

        return;

    }


    const saved =
        await isIdeaSaved();


    if (saved) {

        saveBtn.classList.add(
            "saved"
        );


        if (saveIcon) {

            saveIcon.className =
                "fa-solid fa-heart";

        }


        if (saveText) {

            saveText.textContent =
                "Saved";

        }

    }

    else {

        saveBtn.classList.remove(
            "saved"
        );


        if (saveIcon) {

            saveIcon.className =
                "fa-regular fa-heart";

        }


        if (saveText) {

            saveText.textContent =
                "Save Idea";

        }

    }

}


/* ==================================================
        SAVE / UNSAVE IDEA
================================================== */

if (saveBtn) {

    saveBtn.addEventListener(

        "click",

        async function () {

            const token =
                localStorage.getItem(
                    "ideasphereToken"
                );


            if (!token) {

                alert(
                    "⚠️ Please login first."
                );


                window.location.href =
                    "login.html";


                return;

            }


            if (!selectedIdeaId) {

                alert(
                    "⚠️ No idea selected."
                );


                return;

            }


            try {

                /* ==================================================
                        IMPORTANT:
                        WAIT FOR REAL BOOLEAN VALUE
                ================================================== */

                const currentlySaved =
                    await isIdeaSaved();


                /* ==================================================
                        UNSAVE IDEA
                ================================================== */

                if (currentlySaved) {

                    const response =
                        await fetch(

                            `https://ideasphere-622p.onrender.com/api/ideas/${selectedIdeaId}/save`,

                            {

                                method: "DELETE",

                                headers: {

                                    "Authorization":
                                        "Bearer " + token

                                }

                            }

                        );


                    const data =
                        await response.json();


                    console.log(
                        "UNSAVE RESULT:",
                        data
                    );


                    if (
                        !response.ok ||
                        !data.success
                    ) {

                        throw new Error(

                            data.message ||
                            "Failed to remove saved idea."

                        );

                    }


                    alert(
                        "💔 Idea removed from Saved Ideas."
                    );

                }


                /* ==================================================
                        SAVE IDEA
                ================================================== */

                else {

                    const response =
                        await fetch(

                            `https://ideasphere-622p.onrender.com/api/ideas/${selectedIdeaId}/save`,

                            {

                                method: "POST",

                                headers: {

                                    "Authorization":
                                        "Bearer " + token

                                }

                            }

                        );


                    const data =
                        await response.json();


                    console.log(
                        "SAVE RESULT:",
                        data
                    );


                    if (
                        !response.ok ||
                        !data.success
                    ) {

                        throw new Error(

                            data.message ||
                            "Failed to save idea."

                        );

                    }


                    alert(
                        "❤️ Idea saved successfully!"
                    );

                }


                /* ==================================================
                        REFRESH BUTTON
                ================================================== */

                await updateSaveButton();

            }

            catch (error) {

                console.error(
                    "Save / Unsave Error:",
                    error
                );


                alert(

                    "⚠️ " +
                    (
                        error.message ||
                        "Unable to update saved idea."
                    )

                );

            }

        }

    );

}


/* ==================================================
        DELETE MODAL
================================================== */

const deleteBtn =
    document.getElementById(
        "deleteBtn"
    );


const deleteModal =
    document.getElementById(
        "deleteModal"
    );


const cancelDelete =
    document.getElementById(
        "cancelDelete"
    );


const confirmDelete =
    document.getElementById(
        "confirmDelete"
    );


/* ==================================================
        OPEN DELETE MODAL
================================================== */

if (deleteBtn) {

    deleteBtn.addEventListener(

        "click",

        function () {

            if (deleteModal) {

                deleteModal.classList.add(
                    "show"
                );

            }

        }

    );

}


/* ==================================================
        CLOSE DELETE MODAL
================================================== */

if (cancelDelete) {

    cancelDelete.addEventListener(

        "click",

        function () {

            if (deleteModal) {

                deleteModal.classList.remove(
                    "show"
                );

            }

        }

    );

}


/* ==================================================
        CLICK OUTSIDE MODAL
================================================== */

window.addEventListener(

    "click",

    function (event) {

        if (
            deleteModal &&
            event.target === deleteModal
        ) {

            deleteModal.classList.remove(
                "show"
            );

        }

    }

);


/* ==================================================
        DELETE PROJECT FROM MONGODB
================================================== */

if (confirmDelete) {

    confirmDelete.addEventListener(

        "click",

        async function () {

            try {

                const token =
                    localStorage.getItem(
                        "ideasphereToken"
                    );


                if (!token) {

                    alert(
                        "⚠️ Please login first."
                    );


                    window.location.href =
                        "login.html";


                    return;

                }


                /* ==================================================
                        DELETE REQUEST
                ================================================== */

                const response =
                    await fetch(

                        `https://ideasphere-622p.onrender.com/api/ideas/${selectedIdeaId}`,

                        {

                            method: "DELETE",

                            headers: {

                                "Authorization":
                                    "Bearer " +
                                    token

                            }

                        }

                    );


                const data =
                    await response.json();


                console.log(
                    "Delete Idea:",
                    data
                );


                /* ==================================================
                        DELETE SUCCESS
                ================================================== */

                if (
                    response.ok &&
                    data.success
                ) {

                    if (deleteModal) {

                        deleteModal.classList.remove(
                            "show"
                        );

                    }


                    alert(
                        "🗑️ Idea deleted successfully!"
                    );


                    localStorage.removeItem(
                        "selectedIdeaId"
                    );


                    localStorage.removeItem(
                        "editMode"
                    );


                    window.location.href =
                        "home.html";

                }

                else {

                    alert(

                        "⚠️ " +
                        (
                            data.message ||
                            "Failed to delete idea."
                        )

                    );

                }

            }

            catch (error) {

                console.error(
                    "Delete Idea Error:",
                    error
                );


                alert(
                    "⚠️ Unable to connect to the server."
                );

            }

        }

    );

}


/* ==================================================
        OPEN AI VALIDATOR
================================================== */

const validateBtn =
    document.getElementById(
        "validateBtn"
    );


if (validateBtn) {

    validateBtn.addEventListener(

        "click",

        function () {

            /*
                selectedIdeaId is already stored.

                AI Validator can use
                the same MongoDB ID.
            */

            window.location.href =
                "ai-validator.html";

        }

    );

}


/* ==================================================
        LOGOUT
================================================== */

const logoutBtn =
    document.getElementById(
        "logoutBtn"
    );


if (logoutBtn) {

    logoutBtn.addEventListener(

        "click",

        function () {

            const confirmLogout =
                confirm(
                    "Are you sure you want to logout?"
                );


            if (!confirmLogout) {

                return;

            }


            localStorage.removeItem(
                "selectedIdeaId"
            );


            localStorage.removeItem(
                "editIdeaIndex"
            );


            localStorage.removeItem(
                "editMode"
            );


            localStorage.removeItem(
                "ideasphereToken"
            );


            window.location.href =
                "login.html";

        }

    );

}


/* ==================================================
        INITIALIZE
================================================== */

loadIdea();
