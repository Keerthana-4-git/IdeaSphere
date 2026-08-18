/* ==================================================
                API CONFIGURATION
================================================== */

const API_BASE_URL =
    "https://ideaspere-622p.onrender.com/api";


/* ==================================================
                AUTH TOKEN
================================================== */

function getToken() {

    return localStorage.getItem(
        "ideasphereToken"
    );

}


/* ==================================================
                DOM ELEMENTS
================================================== */

const savedIdeasContainer =
    document.getElementById(
        "savedIdeasContainer"
    );


const savedCountNumber =
    document.getElementById(
        "savedCountNumber"
    );


const savedCount =
    document.getElementById(
        "savedCount"
    );


const allCount =
    document.getElementById(
        "allCount"
    );


const myCount =
    document.getElementById(
        "myCount"
    );


const exploreCount =
    document.getElementById(
        "exploreCount"
    );


const visibleSavedCount =
    document.getElementById(
        "visibleSavedCount"
    );


const savedSearchInput =
    document.getElementById(
        "savedSearchInput"
    );


const clearSavedSearch =
    document.getElementById(
        "clearSavedSearch"
    );


const savedTabs =
    document.querySelectorAll(
        ".saved-tab"
    );


const savedToast =
    document.getElementById(
        "savedToast"
    );


/* ==================================================
                    PAGE STATE
================================================== */

let savedIdeas = [];

let activeFilter = "all";

let toastTimer = null;


/* ==================================================
                    ESCAPE HTML
================================================== */

function escapeHTML(value) {

    return String(value ?? "")

        .replaceAll("&", "&amp;")

        .replaceAll("<", "&lt;")

        .replaceAll(">", "&gt;")

        .replaceAll('"', "&quot;")

        .replaceAll("'", "&#039;");

}


/* ==================================================
                NORMALIZE IDEA
================================================== */

function normalizeIdea(idea) {

    return {

        ...idea,

        id:
            idea._id ||
            idea.id,

        source: "my"

    };

}


/* ==================================================
                FETCH ALL SAVED IDEAS
================================================== */

async function fetchSavedIdeas() {

    const token =
        getToken();


    if (!token) {

        console.warn(
            "No authentication token found."
        );

        savedIdeas = [];

        displaySavedIdeas();

        return;

    }


    try {

        /* ==========================================
                    MY SAVED IDEAS
        ========================================== */

        const myResult =
            await getSavedIdeas();


        /* ==========================================
                EXPLORE SAVED IDEAS
        ========================================== */

        const exploreResult =
            await getSavedExploreIdeas();


        /* ==========================================
                    MY IDEAS
        ========================================== */

        let mySavedIdeas = [];


        if (
            myResult.success &&
            Array.isArray(myResult.ideas)
        ) {

            mySavedIdeas =
                myResult.ideas.map(

                    idea => ({

                        ...idea,

                        id:
                            idea._id ||
                            idea.id,

                        source:
                            "my"

                    })

                );

        }


        /* ==========================================
                EXPLORE IDEAS
        ========================================== */

        let exploreSavedIdeas = [];


        if (
            exploreResult.success &&
            Array.isArray(exploreResult.ideas)
        ) {

            exploreSavedIdeas =
                exploreResult.ideas.map(

                    idea => ({

                        ...idea,

                        id:
                            idea._id ||
                            idea.id,

                        source:
                            "explore",

                        exploreId:
                            idea.exploreId

                    })

                );

        }


        /* ==========================================
                COMBINE BOTH SOURCES
        ========================================== */

        savedIdeas = [

            ...mySavedIdeas,

            ...exploreSavedIdeas

        ];


        console.log(
            "Saved My Ideas:",
            mySavedIdeas
        );


        console.log(
            "Saved Explore Ideas:",
            exploreSavedIdeas
        );


        console.log(
            "All Saved Ideas:",
            savedIdeas
        );


        displaySavedIdeas();

    }

    catch (error) {

        console.error(
            "Fetch Saved Ideas Error:",
            error
        );


        savedIdeas = [];


        displaySavedIdeas();

    }

}


/* ==================================================
                GET MY SAVED IDEAS
================================================== */

function getMySavedIdeas() {

    return savedIdeas.filter(

        idea =>
            idea.source === "my"

    );

}


/* ==================================================
              GET EXPLORE SAVED IDEAS
================================================== */

function getExploreSavedIdeas() {

    return savedIdeas.filter(

        idea =>
            idea.source === "explore"

    );

}

/* ==================================================
                GET ALL SAVED IDEAS
================================================== */

function getAllSavedIdeas() {

    const myIdeas =
        getMySavedIdeas();


    const exploreIdeas =
        getExploreSavedIdeas();


    return [

        ...myIdeas,

        ...exploreIdeas

    ];

}


/* ==================================================
                GET IDEA DESCRIPTION
================================================== */

function getIdeaDescription(idea) {

    return (

        idea.description ||

        idea.solution ||

        idea.problem ||

        "Continue exploring this idea inside IdeaSphere."

    );

}


/* ==================================================
                GET VISIBLE IDEAS
================================================== */

function getVisibleSavedIdeas() {

    const searchValue =
        savedSearchInput.value
            .trim()
            .toLowerCase();


    let ideasToShow =
        getAllSavedIdeas();


    /* ==================================================
                    FILTER
    ================================================== */

    if (activeFilter === "my") {

        ideasToShow =
            ideasToShow.filter(

                idea =>
                    idea.source === "my"

            );

    }


    else if (
        activeFilter === "explore"
    ) {

        ideasToShow =
            ideasToShow.filter(

                idea =>
                    idea.source === "explore"

            );

    }


    /* ==================================================
                    SEARCH
    ================================================== */

    if (searchValue) {

        ideasToShow =
            ideasToShow.filter(

                idea => {

                    const searchableContent = `

                        ${idea.title || ""}

                        ${idea.category || ""}

                        ${idea.stage || ""}

                        ${idea.priority || ""}

                        ${idea.description || ""}

                        ${idea.problem || ""}

                        ${idea.solution || ""}

                        ${idea.audience || ""}

                        ${
                            Array.isArray(
                                idea.tags
                            )

                                ? idea.tags.join(" ")

                                : ""
                        }

                    `.toLowerCase();


                    return searchableContent.includes(
                        searchValue
                    );

                }

            );

    }


    return ideasToShow;

}


/* ==================================================
                    UPDATE COUNTS
================================================== */

function updateCounts() {

    const myIdeas =
        getMySavedIdeas();


    const exploreIdeas =
        getExploreSavedIdeas();


    const allIdeas =
        getAllSavedIdeas();


    savedCountNumber.textContent =
        allIdeas.length;


    savedCount.textContent =

        allIdeas.length === 1

            ? "Saved Idea"

            : "Saved Ideas";


    allCount.textContent =
        allIdeas.length;


    myCount.textContent =
        myIdeas.length;


    exploreCount.textContent =
        exploreIdeas.length;

}


/* ==================================================
                CREATE SAVED IDEA CARD
================================================== */

function createSavedIdeaCard(idea) {

    const isMyIdea =
        idea.source === "my";


    const sourceLabel =
        isMyIdea

            ? "MY IDEA"

            : "FROM EXPLORE";


    const sourceIcon =
        isMyIdea

            ? "fa-lightbulb"

            : "fa-compass";


    const description =
        getIdeaDescription(
            idea
        );


    const tags = [];


    if (idea.category) {

        tags.push(
            idea.category
        );

    }


    if (idea.priority) {

        tags.push(
            idea.priority
        );

    }


    if (idea.stage) {

        tags.push(
            idea.stage
        );

    }


    if (

        Array.isArray(idea.tags) &&

        tags.length < 3

    ) {

        idea.tags.forEach(
            tag => {

                if (

                    tag &&

                    !tags.includes(tag) &&

                    tags.length < 3

                ) {

                    tags.push(tag);

                }

            }
        );

    }


    return `

        <article
            class="saved-idea-card"
            data-source="${escapeHTML(idea.source)}"
        >

            <div class="idea-card-top">

                <div>

                    <span class="saved-source-label">

                        <i class="fa-solid ${sourceIcon}"></i>

                        ${sourceLabel}

                    </span>


                    <h3>

                        ${escapeHTML(
                            idea.title
                        )}

                    </h3>

                </div>


                <div class="heart-icon">

                    <i class="fa-solid fa-heart"></i>

                </div>

            </div>


            <p class="idea-description">

                ${escapeHTML(
                    description
                )}

            </p>


            <div class="idea-meta">

                ${

                    tags

                        .map(

                            tag => `

                                <span class="idea-tag">

                                    ${escapeHTML(tag)}

                                </span>

                            `

                        )

                        .join("")

                }

            </div>


            <div class="card-actions">

                ${
                    isMyIdea

                        ? `

                            <button
                                class="open-btn"
                                data-action="open"
                                data-id="${escapeHTML(
                                    idea.id
                                )}"
                                data-source="my"
                            >

                                <i class="fa-solid fa-arrow-up-right-from-square"></i>

                                Open Project

                            </button>


                            <button
                                class="validate-btn"
                                data-action="validate"
                                data-id="${escapeHTML(
                                    idea.id
                                )}"
                                data-source="my"
                            >

                                <i class="fa-solid fa-wand-magic-sparkles"></i>

                                Validate with AI

                            </button>

                        `

                        : `

                            <button
                                class="open-btn"
                                data-action="explore"
                                data-id="${escapeHTML(
                                    idea.id
                                )}"
                                data-source="explore"
                            >

                                <i class="fa-solid fa-compass"></i>

                                Explore Idea

                            </button>

                        `
                }


                <button
                    class="remove-btn"
                    data-action="remove"
                    data-id="${escapeHTML(
                        idea.id
                    )}"
                    data-source="${escapeHTML(
                        idea.source
                    )}"
                >

                    <i class="fa-regular fa-heart"></i>

                    Remove from Saved

                </button>

            </div>

        </article>

    `;

}


/* ==================================================
                CREATE EMPTY STATE
================================================== */

function createEmptyState() {

    let title =
        "No Saved Ideas Yet";


    let message =
        "Save ideas you love and they will appear here for quick access.";


    let buttonText =
        "Explore Ideas";


    let buttonPage =
        "explore-ideas.html";


    if (activeFilter === "my") {

        title =
            "No Saved Projects Yet";


        message =
            "Save one of your own IdeaSphere projects and it will appear here.";


        buttonText =
            "Go to Dashboard";


        buttonPage =
            "home.html";

    }


    else if (
        activeFilter === "explore"
    ) {

        title =
            "No Explore Ideas Saved";


        message =
            "Discover an idea that inspires you and tap the heart to save it.";


        buttonText =
            "Discover Ideas";


        buttonPage =
            "explore-ideas.html";

    }


    return `

        <div class="empty-state">

            <div class="empty-icon">

                <i class="fa-regular fa-heart"></i>

            </div>


            <h3>

                ${title}

            </h3>


            <p>

                ${message}

            </p>


            <button
                class="explore-btn"
                onclick="window.location.href='${buttonPage}'"
            >

                <i class="fa-solid fa-compass"></i>

                ${buttonText}

            </button>

        </div>

    `;

}


/* ==================================================
                DISPLAY SAVED IDEAS
================================================== */

function displaySavedIdeas() {

    const visibleIdeas =
        getVisibleSavedIdeas();


    updateCounts();


    visibleSavedCount.textContent =
        visibleIdeas.length;


    savedIdeasContainer.innerHTML = "";


    if (
        visibleIdeas.length === 0
    ) {

        savedIdeasContainer.innerHTML =
            createEmptyState();


        return;

    }


    savedIdeasContainer.innerHTML =

        [...visibleIdeas]

            .reverse()

            .map(
                createSavedIdeaCard
            )

            .join("");

}


/* ==================================================
                REMOVE SAVED IDEA
================================================== */

async function removeSavedIdea(
    id,
    source
) {

    /* ==================================================
                    MY IDEA
    ================================================== */

    if (source === "my") {

        const token =
            getToken();


        if (!token) {

            showSavedToast(

                "Not Logged In",

                "Please log in again to manage saved ideas."

            );

            return;

        }


        try {

            const result =
                await unsaveIdea(id);


            if (!result.success) {

                throw new Error(

                    result.message ||

                    "Failed to remove saved idea."

                );

            }


            savedIdeas =
                savedIdeas.filter(

                    idea =>

                        String(
                            idea.id
                        ) !== String(id)

                );


            showSavedToast(

                "Idea Removed",

                "The idea was removed from your saved collection."

            );


            displaySavedIdeas();

        }

        catch (error) {

            console.error(

                "Unsave Idea Error:",

                error

            );


            showSavedToast(

                "Unable to Remove",

                error.message ||

                "Something went wrong."

            );

        }


        return;

    }


    /* ==================================================
                    EXPLORE IDEA
    ================================================== */

    if (source === "explore") {

        try {

            const exploreIdea =
                savedIdeas.find(

                    idea =>

                        idea.source === "explore" &&

                        String(
                            idea.id
                        ) ===
                        String(id)

                );


            if (!exploreIdea) {

                showSavedToast(

                    "Unable to Remove",

                    "Saved Explore idea was not found."

                );

                return;

            }


            const exploreId =
                exploreIdea.exploreId;


            if (!exploreId) {

                showSavedToast(

                    "Unable to Remove",

                    "Explore idea ID is missing."

                );

                return;

            }


            /* ==========================================
                    DELETE FROM MONGODB
            ========================================== */

            const result =
                await unsaveExploreIdea(
                    exploreId
                );


            if (!result.success) {

                throw new Error(

                    result.message ||

                    "Failed to remove saved Explore idea."

                );

            }


            /* ==========================================
                    REMOVE FROM LOCAL PAGE STATE
            ========================================== */

            savedIdeas =
                savedIdeas.filter(

                    idea =>

                        !(
                            idea.source === "explore" &&

                            String(
                                idea.id
                            ) ===
                            String(id)

                        )

                );


            showSavedToast(

                "Idea Removed",

                "The idea was removed from your saved collection."

            );


            displaySavedIdeas();

        }

        catch (error) {

            console.error(

                "Unsave Explore Idea Error:",

                error

            );


            showSavedToast(

                "Unable to Remove",

                error.message ||

                "Something went wrong."

            );

        }


        return;

    }

}

/* ==================================================
                    SHOW TOAST
================================================== */

function showSavedToast(
    title,
    message
) {

    document.getElementById(
        "savedToastTitle"
    ).textContent =
        title;


    document.getElementById(
        "savedToastMessage"
    ).textContent =
        message;


    savedToast.classList.add(
        "show"
    );


    clearTimeout(
        toastTimer
    );


    toastTimer =
        setTimeout(

            () => {

                savedToast.classList.remove(
                    "show"
                );

            },

            3000

        );

}


/* ==================================================
                    CARD ACTIONS
================================================== */

savedIdeasContainer.addEventListener(

    "click",

    function (event) {

        const button =
            event.target.closest(
                "button[data-action]"
            );


        if (!button) {

            return;

        }


        const action =
            button.dataset.action;


        const ideaId =
            button.dataset.id;


        const source =
            button.dataset.source;


        /* ==================================================
                        OPEN MY PROJECT
        ================================================== */

        if (action === "open") {

            localStorage.setItem(

                "selectedIdeaId",

                ideaId

            );


            window.location.href =
                "project-details.html";


            return;

        }


        /* ==================================================
                        VALIDATE MY IDEA
        ================================================== */

        if (action === "validate") {

            localStorage.setItem(

                "selectedIdeaId",

                ideaId

            );


            window.location.href =
                "ai-validator.html";


            return;

        }


        /* ==================================================
                    OPEN EXPLORE IDEA
        ================================================== */

        if (action === "explore") {

            localStorage.setItem(

                "openExploreIdeaId",

                ideaId

            );


            window.location.href =
                "explore-ideas.html";


            return;

        }


        /* ==================================================
                        REMOVE SAVED IDEA
        ================================================== */

        if (action === "remove") {

            removeSavedIdea(

                ideaId,

                source

            );

        }

    }

);


/* ==================================================
                    TAB FILTERS
================================================== */

savedTabs.forEach(

    tab => {

        tab.addEventListener(

            "click",

            function () {

                savedTabs.forEach(

                    item => {

                        item.classList.remove(
                            "active"
                        );

                    }

                );


                this.classList.add(
                    "active"
                );


                activeFilter =
                    this.dataset.filter;


                displaySavedIdeas();

            }

        );

    }

);


/* ==================================================
                    SEARCH
================================================== */

savedSearchInput.addEventListener(

    "input",

    function () {

        clearSavedSearch.classList.toggle(

            "show",

            this.value.length > 0

        );


        displaySavedIdeas();

    }

);


clearSavedSearch.addEventListener(

    "click",

    function () {

        savedSearchInput.value = "";


        clearSavedSearch.classList.remove(
            "show"
        );


        savedSearchInput.focus();


        displaySavedIdeas();

    }

);


/* ==================================================
            REFRESH WHEN PAGE BECOMES ACTIVE
================================================== */

window.addEventListener(

    "pageshow",

    function () {

        fetchSavedIdeas();

    }

);


/* ==================================================
                    INITIAL LOAD
================================================== */

fetchSavedIdeas();
