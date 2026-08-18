/* ==========================================
        IDEASPHERE - HOME.JS
========================================== */


/* ==========================================
        LOAD LOGGED-IN USER
========================================== */

async function loadCurrentUser() {

    try {

        const token =
            localStorage.getItem("ideasphereToken");

        if (!token) {

            console.log("No login token found.");

            return;

        }


        const response = await fetch(
            "https://ideaspere-622p.onrender.com/api/auth/me",
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
            "Current User:",
            data
        );


        if (
            data.success &&
            data.user
        ) {

            const user =
                data.user;


            /* ==========================
                    WELCOME MESSAGE
            ========================== */

            const welcomeMessage =
                document.getElementById(
                    "welcomeMessage"
                );


            if (welcomeMessage) {

                welcomeMessage.textContent =
                    `Welcome Back, ${user.fullName} 👋`;

            }


            /* ==========================
                    PROFILE AVATAR
            ========================== */

            const profileAvatar =
                document.getElementById(
                    "profileBtn"
                );


            if (
                profileAvatar &&
                user.fullName
            ) {

                profileAvatar.textContent =
                    user.fullName
                        .charAt(0)
                        .toUpperCase();

            }

        }

    }

    catch (error) {

        console.error(
            "User Load Error:",
            error
        );

    }

}


/* ==========================================
        LOAD IDEAS FROM MONGODB
========================================== */

async function loadIdeas() {

    const ideasContainer =
        document.getElementById(
            "ideasContainer"
        );


    if (!ideasContainer) {

        return;

    }


    try {

        const token =
            localStorage.getItem(
                "ideasphereToken"
            );


        /* ==========================
                LOGIN CHECK
        ========================== */

        if (!token) {

            console.log(
                "No authentication token."
            );

            return;

        }


        /* ==========================
                GET IDEAS
        ========================== */

        const response =
            await fetch(
                "https://ideaspere-622p.onrender.com/api/ideas",
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
            "Ideas from MongoDB:",
            data
        );


        /* ==========================
                ERROR
        ========================== */

        if (
            !response.ok ||
            !data.success
        ) {

            console.error(
                "Ideas Fetch Failed:",
                data
            );

            return;

        }


        const ideas =
            Array.isArray(data.ideas)
                ? data.ideas
                : [];


        /* ==========================
                STORE FOR OTHER PAGES
        ========================== */

        window.ideaSphereIdeas =
            ideas;


        /* ==========================
                EMPTY STATE
        ========================== */

        if (
            ideas.length === 0
        ) {

            ideasContainer.innerHTML = `

                <div class="empty-state">

                    <i class="fa-solid fa-lightbulb"></i>

                    <h3>No Ideas Yet</h3>

                    <p>
                        Your innovation journey
                        starts here.<br>

                        Click
                        <strong>
                            Create New Idea
                        </strong>
                        to begin.
                    </p>

                </div>

            `;

            return;

        }


        /* ==========================
                DISPLAY IDEAS
        ========================== */

        ideasContainer.innerHTML = "";


        ideas.forEach(
            function (idea) {

                const ideaCard =
                    document.createElement(
                        "div"
                    );


                ideaCard.classList.add(
                    "idea-card"
                );


                ideaCard.innerHTML = `

                    <h3>

                        ${escapeHTML(
                            idea.title ||
                            "Untitled Idea"
                        )}

                    </h3>


                    <p>

                        ${escapeHTML(
                            (
                                idea.solution ||
                                "No solution description available"
                            ).substring(0, 120)
                        )}

                        ${
                            idea.solution &&
                            idea.solution.length > 120
                                ? "..."
                                : ""
                        }

                    </p>


                    <div class="idea-meta">

                        <span class="idea-tag">

                            ${escapeHTML(
                                idea.category ||
                                "General"
                            )}

                        </span>


                        <span class="idea-tag">

                            ${escapeHTML(
                                idea.priority ||
                                "Medium"
                            )}

                        </span>


                        <span class="idea-tag">

                            ${escapeHTML(
                                idea.stage ||
                                "Idea"
                            )}

                        </span>

                    </div>

                `;


                /* ==========================
                        OPEN IDEA
                ========================== */

                ideaCard.addEventListener(
                    "click",
                    function () {

                        openIdea(
                            idea._id
                        );

                    }
                );


                ideasContainer.appendChild(
                    ideaCard
                );

            }
        );

    }

    catch (error) {

        console.error(
            "Load Ideas Error:",
            error
        );

    }

}


/* ==========================================
        OPEN PROJECT DETAILS
========================================== */

function openIdea(id) {

    if (!id) {

        alert(
            "⚠ Unable to open this idea."
        );

        return;

    }


    localStorage.setItem(
        "selectedIdeaId",
        String(id)
    );


    window.location.href =
        "project-details.html";

}


/* ==========================================
        OPEN AI VALIDATOR
========================================== */

function openAIValidator() {

    const ideas =
        window.ideaSphereIdeas || [];


    if (
        ideas.length === 0
    ) {

        alert(
            "⚠ Please create an idea first."
        );

        return;

    }


    localStorage.removeItem(
        "selectedIdeaId"
    );


    window.location.href =
        "ai-validator.html";

}


/* ==========================================
        HTML SECURITY HELPER
========================================== */

function escapeHTML(value) {

    return String(value)

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
        );

}


/* ==========================================
        CREATE IDEA BUTTON
========================================== */

const createIdeaBtn =
    document.getElementById(
        "createIdeaBtn"
    );


if (createIdeaBtn) {

    createIdeaBtn.addEventListener(
        "click",
        function () {

            localStorage.removeItem(
                "editIdeaIndex"
            );

            localStorage.removeItem(
                "selectedIdeaId"
            );

            localStorage.removeItem(
                "editMode"
            );

            window.location.href =
                "create-idea.html";

        }
    );

}


/* ==========================================
        AI VALIDATOR CARD
========================================== */

const aiValidatorCard =
    document.getElementById(
        "aiValidatorCard"
    );


if (aiValidatorCard) {

    aiValidatorCard.addEventListener(
        "click",
        openAIValidator
    );

}


/* ==========================================
        SIDEBAR AI VALIDATOR
========================================== */

const sidebarAI =
    document.getElementById(
        "sidebarAI"
    );


if (sidebarAI) {

    sidebarAI.addEventListener(
        "click",
        openAIValidator
    );

}


/* ==========================================
        TRENDING IDEAS CARD
========================================== */

const trendingIdeasCard =
    document.getElementById(
        "trendingIdeasCard"
    );


if (trendingIdeasCard) {

    trendingIdeasCard.addEventListener(
        "click",
        function () {

            window.location.href =
                "explore-ideas.html";

        }
    );

}


/* ==========================================
        COMMUNITY CARD
========================================== */

const communityCard =
    document.getElementById(
        "communityCard"
    );


if (communityCard) {

    communityCard.addEventListener(
        "click",
        function () {

            window.location.href =
                "collaborate.html";

        }
    );

}


/* ==========================================
        PROFILE BUTTON
========================================== */

const profileBtn =
    document.getElementById(
        "profileBtn"
    );


if (profileBtn) {

    profileBtn.addEventListener(
        "click",
        function () {

            window.location.href =
                "settings.html";

        }
    );

}


/* ==========================================
        INITIALIZE DASHBOARD
========================================== */

loadCurrentUser();

loadIdeas();
