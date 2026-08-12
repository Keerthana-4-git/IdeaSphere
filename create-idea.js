/* ==================================================
        IDEASPHERE - CREATE IDEA
================================================== */


/* ==================================================
        GET FORM ELEMENTS
================================================== */

const ideaForm = document.getElementById("ideaForm");

const ideaTitle = document.getElementById("ideaTitle");
const problem = document.getElementById("problem");
const solution = document.getElementById("solution");
const category = document.getElementById("category");
const audience = document.getElementById("audience");
const stage = document.getElementById("stage");
const priority = document.getElementById("priority");
const coverImage = document.getElementById("coverImage");


/* ==================================================
        LOGIN TOKEN
================================================== */

const token =
    localStorage.getItem("ideasphereToken");


/* ==================================================
        EDIT MODE
================================================== */

const editMode =
    localStorage.getItem("editMode") === "true";

const selectedIdeaId =
    localStorage.getItem("selectedIdeaId");


/* ==================================================
        LOAD IDEA FOR EDITING
================================================== */

async function loadIdeaForEdit() {

    if (!editMode) {

        return;

    }


    if (!selectedIdeaId) {

        console.error(
            "Edit mode is active but no selectedIdeaId was found."
        );

        alert(
            "⚠️ Unable to identify the idea you want to edit."
        );

        window.location.href =
            "home.html";

        return;

    }


    if (!token) {

        alert(
            "⚠️ Please login first."
        );

        window.location.href =
            "login.html";

        return;

    }


    try {

        const response = await fetch(

            `http://localhost:5000/api/ideas/${selectedIdeaId}`,

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
            "Edit Idea Response:",
            data
        );


        if (!response.ok || !data.success) {

            alert(
                "⚠️ " +
                (
                    data.message ||
                    "Unable to load the idea."
                )
            );

            return;

        }


        const idea =
            data.idea;


        /* ==========================================
                FILL FORM
        ========================================== */

        ideaTitle.value =
            idea.title || "";


        problem.value =
            idea.problem || "";


        solution.value =
            idea.solution || "";


        category.value =
            idea.category || "";


        audience.value =
            idea.audience || "";


        stage.value =
            idea.stage || "";


        priority.value =
            idea.priority || "";


        /*
            File inputs cannot be populated
            programmatically for security reasons.

            Therefore coverImage is intentionally
            left empty when editing.
        */


        /* ==========================================
                CHANGE PAGE TITLE
        ========================================== */

        const pageTitle =
            document.querySelector("h1");

        if (pageTitle) {

            pageTitle.textContent =
                "Edit Idea";

        }


        /* ==========================================
                CHANGE SAVE BUTTON
        ========================================== */

        const saveBtn =
            document.querySelector(".save-btn");

        if (saveBtn) {

            saveBtn.textContent =
                "Update Idea";

        }


        console.log(
            "✅ Idea loaded for editing:",
            idea
        );

    }


    catch (error) {

        console.error(
            "Load Edit Idea Error:",
            error
        );


        alert(
            "⚠️ Unable to connect to the server."
        );

    }

}


/* ==================================================
        LOAD EDIT IDEA
================================================== */

loadIdeaForEdit();


/* ==================================================
        SAVE / UPDATE IDEA
================================================== */

ideaForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        /* ==========================================
                GET FORM VALUES
        ========================================== */

        const title =
            ideaTitle.value.trim();


        const problemText =
            problem.value.trim();


        const solutionText =
            solution.value.trim();


        const audienceText =
            audience.value.trim();


        /* ==========================================
                VALIDATION
        ========================================== */

        if (title === "") {

            alert(
                "⚠️ Please enter an Idea Title."
            );

            return;

        }


        if (title.length < 5) {

            alert(
                "⚠️ Idea Title should contain at least 5 characters."
            );

            return;

        }


        if (problemText === "") {

            alert(
                "⚠️ Please enter the Problem Statement."
            );

            return;

        }


        if (problemText.length < 20) {

            alert(
                "⚠️ Problem Statement should contain at least 20 characters."
            );

            return;

        }


        if (solutionText === "") {

            alert(
                "⚠️ Please describe your Solution."
            );

            return;

        }


        if (solutionText.length < 30) {

            alert(
                "⚠️ Solution Description should contain at least 30 characters."
            );

            return;

        }


        if (audienceText === "") {

            alert(
                "⚠️ Please enter the Target Audience."
            );

            return;

        }


        /* ==================================================
                CHECK LOGIN
        ================================================== */

        if (!token) {

            alert(
                "⚠️ Please login first."
            );

            window.location.href =
                "login.html";

            return;

        }


        /* ==================================================
                UPDATE EXISTING IDEA
        ================================================== */

        if (editMode && selectedIdeaId) {

            try {

                const response = await fetch(

                    `http://localhost:5000/api/ideas/${selectedIdeaId}`,

                    {

                        method: "PUT",

                        headers: {

                            "Content-Type":
                                "application/json",

                            "Authorization":
                                "Bearer " + token

                        },

                        body: JSON.stringify({

                            title: title,

                            problem: problemText,

                            solution: solutionText,

                            category:
                                category.value,

                            audience:
                                audienceText,

                            stage:
                                stage.value,

                            priority:
                                priority.value

                        })

                    }

                );


                const data =
                    await response.json();


                console.log(
                    "Update Idea Response:",
                    data
                );


                if (data.success) {

                    alert(
                        "🎉 Idea Updated Successfully!"
                    );


                    /*
                        Remove edit mode.
                    */

                    localStorage.removeItem(
                        "editMode"
                    );


                    /*
                        Keep selectedIdeaId so
                        Project Details can reopen
                        the same idea.
                    */


                    window.location.href =
                        "project-details.html";


                    return;

                }


                alert(
                    "⚠️ " +
                    (
                        data.message ||
                        "Unable to update idea."
                    )
                );

            }


            catch (error) {

                console.error(
                    "Update Idea Error:",
                    error
                );


                alert(
                    "⚠️ Unable to connect to the server."
                );

            }


            return;

        }


        /* ==================================================
                CREATE NEW IDEA
        ================================================== */

        try {

            const response =
                await fetch(

                    "http://localhost:5000/api/ideas",

                    {

                        method: "POST",

                        headers: {

                            "Content-Type":
                                "application/json",

                            "Authorization":
                                "Bearer " + token

                        },

                        body: JSON.stringify({

                            title: title,

                            problem: problemText,

                            solution: solutionText,

                            category:
                                category.value,

                            audience:
                                audienceText,

                            stage:
                                stage.value,

                            priority:
                                priority.value,

                            image:
                                coverImage.value

                        })

                    }

                );


            const data =
                await response.json();


            console.log(
                "Create Idea Response:",
                data
            );


            if (data.success) {

                alert(
                    "🎉 Idea Created Successfully!"
                );


                window.location.href =
                    "home.html";


                return;

            }


            alert(
                "⚠️ " +
                (
                    data.message ||
                    "Unable to create idea."
                )
            );

        }


        catch (error) {

            console.error(
                "Create Idea Error:",
                error
            );


            alert(
                "⚠️ Unable to connect to the server."
            );

        }

    }
);


/* ==================================================
        RESET BUTTON
================================================== */

ideaForm.addEventListener(
    "reset",
    function () {

        setTimeout(
            function () {

                alert(
                    "Form Reset Successfully!"
                );

            },
            100
        );

    }
);




