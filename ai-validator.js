/* ==================================================
        IDEASPHERE AI VALIDATOR
================================================== */

document.addEventListener("DOMContentLoaded", function () {


    /* ==================================================
            API CONFIGURATION
    ================================================== */

    const API_URL =
        "http://localhost:5000/api/validate-idea";


    /* ==================================================
        LOAD IDEAS FROM MONGODB
================================================== */

let ideas = [];


async function loadIdeasFromBackend() {

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


    try {

        const response =
            await fetch(
                "http://localhost:5000/api/ideas",
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
            "AI Validator Ideas:",
            data
        );


        if (
            !response.ok ||
            !data.success
        ) {

            throw new Error(
                data.message ||
                "Failed to load ideas."
            );

        }


       ideas =
    Array.isArray(data.ideas)
        ? data.ideas
        : [];


/* ==================================================
        OPENED FROM PROJECT DETAILS
================================================== */

const selectedIdeaId =
    localStorage.getItem("selectedIdeaId");


if (selectedIdeaId) {

    const selectedIdea =
        ideas.find(function (idea) {

            const ideaId =
                idea._id ||
                idea.id;

            return String(ideaId) ===
                String(selectedIdeaId);

        });


    if (selectedIdea) {

        console.log(
            "AI Validator: Opening selected idea:",
            selectedIdea
        );


        validateIdea(selectedIdea);

        return;

    }

}


/* ==================================================
        NORMAL AI VALIDATOR PAGE
================================================== */

renderIdeaSelector();

    }

    catch (error) {

        console.error(
            "AI Validator Load Error:",
            error
        );


        if (ideaSelectionGrid) {

            ideaSelectionGrid.innerHTML = `

                <div class="selector-empty-state">

                    <i class="fa-solid fa-triangle-exclamation"></i>

                    <h3>
                        Unable to Load Ideas
                    </h3>

                    <p>
                        ${escapeHTML(
                            error.message ||
                            "Unable to connect to the server."
                        )}
                    </p>

                </div>

            `;

        }

    }

}


    /* ==================================================
            DOM ELEMENTS
    ================================================== */

    const ideaSelector =
        document.getElementById("ideaSelector");

    const ideaSelectionGrid =
        document.getElementById("ideaSelectionGrid");

    const analysisContent =
        document.getElementById("analysisContent");

    const changeIdeaBtn =
        document.getElementById("changeIdeaBtn");

    const backBtn =
        document.getElementById("backBtn");

    const backBtnText =
        document.getElementById("backBtnText");

    const dashboardBtn =
        document.getElementById("dashboardBtn");

    const downloadBtn =
        document.getElementById("downloadBtn");


    /* ==================================================
            CURRENT IDEA
    ================================================== */

    let currentIdea = null;

    let currentAnalysis = null;

    let isAnalyzing = false;


    /* ==================================================
            FIX OLD IDEA IDS
    ================================================== */

    function fixIdeaIds() {

        let updated = false;

        const usedIds = new Set();


        ideas = ideas.map(function (idea, index) {

            if (
                idea.id === undefined ||
                idea.id === null ||
                idea.id === "" ||
                idea.id === "undefined"
            ) {

                idea.id = createUniqueIdeaId(index);

                updated = true;

            }


            if (usedIds.has(String(idea.id))) {

                idea.id = createUniqueIdeaId(index);

                updated = true;

            }


            usedIds.add(String(idea.id));


            return idea;

        });


        if (updated) {

            localStorage.setItem(
                "ideas",
                JSON.stringify(ideas)
            );

        }

    }


    /* ==================================================
            CREATE UNIQUE IDEA ID
    ================================================== */

    function createUniqueIdeaId(index) {

        return (

            "idea_" +

            Date.now() +

            "_" +

            index +

            "_" +

            Math.random()
                .toString(36)
                .substring(2, 8)

        );

    }


    /* ==================================================
            SHOW IDEA SELECTOR
    ================================================== */

    function showIdeaSelector() {

        currentIdea = null;

        currentAnalysis = null;


        localStorage.removeItem(
            "selectedIdeaId"
        );


        if (analysisContent) {

            analysisContent.classList.remove("show");

            analysisContent.style.display = "none";

        }


        if (ideaSelector) {

            ideaSelector.style.display = "block";

        }


        if (backBtnText) {

            backBtnText.textContent =
                "Back to Dashboard";

        }


        renderIdeaSelector();


        window.scrollTo({

            top: 0,

            behavior: "smooth"

        });

    }


    /* ==================================================
            RENDER IDEA SELECTOR
    ================================================== */

    function renderIdeaSelector() {

        if (!ideaSelectionGrid) {

            console.error(
                "ideaSelectionGrid element not found."
            );

            return;

        }


        ideaSelectionGrid.innerHTML = "";


        if (ideas.length === 0) {

            ideaSelectionGrid.innerHTML = `

                <div class="selector-empty-state">

                    <i class="fa-regular fa-lightbulb"></i>

                    <h3>No Ideas Available</h3>

                    <p>

                        Create your first idea before using
                        IdeaSphere AI Validator.

                    </p>

                    <button id="createIdeaFromValidator">

                        + Create New Idea

                    </button>

                </div>

            `;


            const createButton =

                document.getElementById(
                    "createIdeaFromValidator"
                );


            if (createButton) {

                createButton.addEventListener(
                    "click",
                    function () {

                        localStorage.removeItem(
                            "editIdeaIndex"
                        );


                        window.location.href =
                            "create-idea.html";

                    }
                );

            }


            return;

        }


        const reversedIdeas = [...ideas].reverse();


        reversedIdeas.forEach(function (idea) {

            const card =
                document.createElement("div");


            card.className =
                "idea-select-card";


            const title =

                idea.title ||

                "Untitled Idea";


            const description =

                idea.solution ||

                idea.problem ||

                "No description available.";


            const category =

                idea.category ||

                "General";


            const priority =

                idea.priority ||

                "Medium";


            const stage =

                idea.stage ||

                "Idea";


            card.innerHTML = `

                <h3>

                    ${escapeHTML(title)}

                </h3>


                <p class="idea-select-description">

                    ${escapeHTML(
                        description.substring(0, 130)
                    )}

                    ${
                        description.length > 130
                            ? "..."
                            : ""
                    }

                </p>


                <div class="idea-select-meta">

                    <span class="idea-select-tag">

                        ${escapeHTML(category)}

                    </span>


                    <span class="idea-select-tag">

                        ${escapeHTML(priority)}

                    </span>


                    <span class="idea-select-tag">

                        ${escapeHTML(stage)}

                    </span>

                </div>


                <button
                    type="button"
                    class="validate-idea-btn">

                    <i class="fa-solid fa-wand-magic-sparkles"></i>

                    Validate Idea

                    <i class="fa-solid fa-arrow-right"></i>

                </button>

            `;


            card.addEventListener(
                "click",
                function () {

                    validateIdea(idea);

                }
            );


            const validateButton =

                card.querySelector(
                    ".validate-idea-btn"
                );


            if (validateButton) {

                validateButton.addEventListener(
                    "click",
                    function (event) {

                        event.stopPropagation();

                        validateIdea(idea);

                    }
                );

            }


            ideaSelectionGrid.appendChild(card);

        });

    }


    /* ==================================================
            VALIDATE IDEA USING GEMINI
    ================================================== */

    async function validateIdea(idea) {

        if (!idea || isAnalyzing) {

            return;

        }


        currentIdea = idea;

        currentAnalysis = null;

        isAnalyzing = true;


        localStorage.setItem(
    "selectedIdeaId",
    String(
        idea._id ||
        idea.id
    )
);


        showAnalyzingState(idea);


        try {

            const response = await fetch(

                API_URL,

                {

                    method: "POST",

                    headers: {

                        "Content-Type":
                            "application/json"

                    },

                    body: JSON.stringify({

                        idea: idea

                    })

                }

            );


            const data = await response.json();


            if (!response.ok) {

                throw new Error(

                    data.error ||

                    data.message ||

                    "AI analysis failed."

                );

            }


            if (
                !data.success ||
                !data.analysis
            ) {

                throw new Error(

                    "Invalid AI analysis response."

                );

            }


            currentAnalysis = data.analysis;


           saveIdeaAnalysis(
    idea._id || idea.id,
    currentAnalysis
);


            displayAnalysis(

                idea,

                currentAnalysis

            );

        }

        catch (error) {

            console.error(

                "IdeaSphere AI Error:",

                error

            );


            showAnalysisError(

                idea,

                error.message

            );

        }

        finally {

            isAnalyzing = false;

        }

    }


    /* ==================================================
            SHOW ANALYZING STATE
    ================================================== */

    function showAnalyzingState(idea) {

        if (ideaSelector) {

            ideaSelector.style.display = "block";

        }


        if (analysisContent) {

            analysisContent.classList.remove("show");

            analysisContent.style.display = "none";

        }


        if (backBtnText) {

            backBtnText.textContent =
                "Back to Dashboard";

        }


        if (!ideaSelectionGrid) {

            return;

        }


        ideaSelectionGrid.innerHTML = `

            <div class="ai-loading-state">

                <div class="ai-loader">

                    <i class="fa-solid fa-wand-magic-sparkles"></i>

                </div>


                <h3>

                    IdeaSphere AI is analyzing

                    <span>

                        ${escapeHTML(
                            idea.title || "your idea"
                        )}

                    </span>

                </h3>


                <p>

                    Evaluating innovation, market demand,
                    feasibility and revenue potential...

                </p>


                <div class="loading-dots">

                    <span></span>

                    <span></span>

                    <span></span>

                </div>

            </div>

        `;

    }


    /* ==================================================
            DISPLAY ANALYSIS
    ================================================== */

    function displayAnalysis(idea, analysis) {

        if (ideaSelector) {

            ideaSelector.style.display = "none";

        }


        if (analysisContent) {

            analysisContent.style.display = "block";

            analysisContent.classList.add("show");

        }


        if (backBtnText) {

            backBtnText.textContent =
                "Back to Project";

        }


        const ideaTitle =
            document.getElementById("ideaTitle");

        const ideaCategory =
            document.getElementById("ideaCategory");


        if (ideaTitle) {

            ideaTitle.textContent =

                idea.title ||

                "Untitled Idea";

        }


        if (ideaCategory) {

            ideaCategory.textContent =

                (idea.category || "General") +

                " • " +

                (idea.stage || "Idea");

        }


        displayScores(analysis);


        loadList(
            "strengths",
            analysis.strengths
        );


        loadList(
            "weaknesses",
            analysis.weaknesses
        );


        loadList(
            "opportunities",
            analysis.opportunities
        );


        loadList(
            "threats",
            analysis.threats
        );


        loadList(
            "suggestions",
            analysis.suggestions
        );


        window.scrollTo({

            top: 0,

            behavior: "smooth"

        });

    }


    /* ==================================================
            DISPLAY SCORES
    ================================================== */

    function displayScores(analysis) {

        const overall =
            normalizeScore(analysis.overall);

        const innovation =
            normalizeScore(analysis.innovation);

        const market =
            normalizeScore(analysis.market);

        const feasibility =
            normalizeScore(analysis.feasibility);

        const revenue =
            normalizeScore(analysis.revenue);


        document.getElementById(
            "overallScore"
        ).textContent = overall + "%";


        document.getElementById(
            "innovationScore"
        ).textContent = innovation + "%";


        document.getElementById(
            "marketScore"
        ).textContent = market + "%";


        document.getElementById(
            "feasibilityScore"
        ).textContent = feasibility + "%";


        document.getElementById(
            "revenueScore"
        ).textContent = revenue + "%";


        const innovationBar =
            document.querySelector(".innovation");

        const marketBar =
            document.querySelector(".market");

        const feasibilityBar =
            document.querySelector(".feasibility");

        const revenueBar =
            document.querySelector(".revenue");


        innovationBar.style.width = "0%";

        marketBar.style.width = "0%";

        feasibilityBar.style.width = "0%";

        revenueBar.style.width = "0%";


        setTimeout(function () {

            innovationBar.style.width =
                innovation + "%";

            marketBar.style.width =
                market + "%";

            feasibilityBar.style.width =
                feasibility + "%";

            revenueBar.style.width =
                revenue + "%";

        }, 150);


        const scoreCircle =

            document.querySelector(
                ".score-circle"
            );


        scoreCircle.style.background =

            `conic-gradient(
                #7A0F14 0deg,
                #7A0F14 ${overall * 3.6}deg,
                #ECECEC ${overall * 3.6}deg
            )`;

    }


    /* ==================================================
            NORMALIZE SCORE
    ================================================== */

    function normalizeScore(score) {

        const number = Number(score);


        if (Number.isNaN(number)) {

            return 0;

        }


        return Math.min(

            100,

            Math.max(

                0,

                Math.round(number)

            )

        );

    }


    /* ==================================================
            LOAD LIST
    ================================================== */

    function loadList(id, data) {

        const list =
            document.getElementById(id);


        if (!list) {

            return;

        }


        list.innerHTML = "";


        const safeData =

            Array.isArray(data)

                ? data

                : [];


        safeData.forEach(function (item) {

            const li =
                document.createElement("li");


            li.textContent = item;


            list.appendChild(li);

        });

    }


    /* ==================================================
            SAVE AI ANALYSIS
    ================================================== */

    function saveIdeaAnalysis(
        ideaId,
        analysis
    ) {

        const ideaIndex = ideas.findIndex(

            function (idea) {

               return String(
    idea._id || idea.id
) === String(ideaId);

            }

        );


        if (ideaIndex === -1) {

            return;

        }


        ideas[ideaIndex].aiAnalysis = analysis;

        ideas[ideaIndex].lastValidatedAt =

            new Date().toISOString();


        localStorage.setItem(

            "ideas",

            JSON.stringify(ideas)

        );

    }


    /* ==================================================
            SHOW ANALYSIS ERROR
    ================================================== */

    function showAnalysisError(idea, message) {

        if (ideaSelector) {

            ideaSelector.style.display = "block";

        }


        if (analysisContent) {

            analysisContent.classList.remove("show");

            analysisContent.style.display = "none";

        }


        if (!ideaSelectionGrid) {

            return;

        }


        ideaSelectionGrid.innerHTML = `

            <div class="ai-error-state">

                <i class="fa-solid fa-triangle-exclamation"></i>


                <h3>

                    AI Analysis Failed

                </h3>


                <p>

                    ${escapeHTML(message)}

                </p>


                <div class="ai-error-actions">

                    <button
                        type="button"
                        id="retryAnalysisBtn">

                        <i class="fa-solid fa-rotate-right"></i>

                        Try Again

                    </button>


                    <button
                        type="button"
                        id="chooseAnotherIdeaBtn">

                        Choose Another Idea

                    </button>

                </div>

            </div>

        `;


        const retryButton =

            document.getElementById(
                "retryAnalysisBtn"
            );


        const chooseAnotherButton =

            document.getElementById(
                "chooseAnotherIdeaBtn"
            );


        if (retryButton) {

            retryButton.addEventListener(
                "click",
                function () {

                    validateIdea(idea);

                }
            );

        }


        if (chooseAnotherButton) {

            chooseAnotherButton.addEventListener(
                "click",
                function () {

                    showIdeaSelector();

                }
            );

        }

    }


    /* ==================================================
            CHANGE IDEA
    ================================================== */

    if (changeIdeaBtn) {

        changeIdeaBtn.addEventListener(
            "click",
            function () {

                showIdeaSelector();

            }
        );

    }


    /* ==================================================
            BACK BUTTON
    ================================================== */

    if (backBtn) {

        backBtn.addEventListener(
            "click",
            function () {

                if (currentIdea) {

                    window.location.href =
                        "project-details.html";

                }

                else {

                    window.location.href =
                        "home.html";

                }

            }
        );

    }


    /* ==================================================
            DASHBOARD BUTTON
    ================================================== */

    if (dashboardBtn) {

        dashboardBtn.addEventListener(
            "click",
            function () {

                window.location.href =
                    "home.html";

            }
        );

    }


    /* ==================================================
            DOWNLOAD PROFESSIONAL PDF REPORT
    ================================================== */

    if (downloadBtn) {

        downloadBtn.addEventListener(
            "click",
            function () {

                if (
                    !currentIdea ||
                    !currentAnalysis
                ) {

                    alert(
                        "Please validate an idea first."
                    );

                    return;

                }


                generateAIReport(

                    currentIdea,

                    currentAnalysis

                );

            }
        );

    }


    /* ==================================================
            GENERATE AI PDF REPORT
    ================================================== */

    function generateAIReport(idea, analysis) {

        if (
            !window.jspdf ||
            !window.jspdf.jsPDF
        ) {

            alert(
                "PDF library could not be loaded. Please check your internet connection and try again."
            );

            return;

        }


        const { jsPDF } = window.jspdf;

        const doc = new jsPDF();


        const pageWidth =
            doc.internal.pageSize.getWidth();

        const pageHeight =
            doc.internal.pageSize.getHeight();

        const margin = 20;

        const contentWidth =
            pageWidth - margin * 2;


        const maroon = [122, 15, 20];

        const dark = [45, 45, 45];

        const gray = [100, 100, 100];

        const lightGray = [240, 240, 240];


        let y = 0;


        /* ==================================================
                PDF HELPERS
        ================================================== */

        function addPageIfNeeded(heightNeeded) {

            if (
                y + heightNeeded >
                pageHeight - 20
            ) {

                doc.addPage();

                drawPageHeader();

                y = 35;

            }

        }


        function drawPageHeader() {

            doc.setFillColor(...maroon);

            doc.rect(
                0,
                0,
                pageWidth,
                12,
                "F"
            );


            doc.setFont(
                "helvetica",
                "bold"
            );

            doc.setFontSize(10);

            doc.setTextColor(...maroon);

            doc.text(
                "IdeaSphere AI",
                margin,
                23
            );


            doc.setFont(
                "helvetica",
                "normal"
            );

            doc.setTextColor(...gray);

            doc.text(
                "AI Validation Report",
                pageWidth - margin,
                23,
                {
                    align: "right"
                }
            );

        }


        function drawSectionTitle(title) {

            addPageIfNeeded(18);


            doc.setFont(
                "helvetica",
                "bold"
            );

            doc.setFontSize(15);

            doc.setTextColor(...maroon);

            doc.text(
                title,
                margin,
                y
            );


            y += 5;


            doc.setDrawColor(...maroon);

            doc.setLineWidth(0.5);

            doc.line(
                margin,
                y,
                pageWidth - margin,
                y
            );


            y += 10;

        }


        function drawList(items) {

            const safeItems =
                Array.isArray(items)
                    ? items
                    : [];


            safeItems.forEach(
                function (item) {

                    const lines =
                        doc.splitTextToSize(

                            String(item),

                            contentWidth - 8

                        );


                    const itemHeight =
                        lines.length * 6 + 5;


                    addPageIfNeeded(itemHeight);


                    doc.setFont(
                        "helvetica",
                        "normal"
                    );

                    doc.setFontSize(10.5);

                    doc.setTextColor(...dark);


                    doc.text(
                        "•",
                        margin,
                        y
                    );


                    doc.text(
                        lines,
                        margin + 6,
                        y
                    );


                    y += itemHeight;

                }
            );

        }


        function drawScoreRow(
            label,
            score
        ) {

            addPageIfNeeded(13);


            const safeScore =
                normalizeScore(score);


            doc.setFont(
                "helvetica",
                "bold"
            );

            doc.setFontSize(10.5);

            doc.setTextColor(...dark);

            doc.text(
                label,
                margin,
                y
            );


            doc.setFont(
                "helvetica",
                "bold"
            );

            doc.setTextColor(...maroon);

            doc.text(
                safeScore + "%",
                pageWidth - margin,
                y,
                {
                    align: "right"
                }
            );


            y += 4;


            doc.setFillColor(...lightGray);

            doc.roundedRect(
                margin,
                y,
                contentWidth,
                3,
                1.5,
                1.5,
                "F"
            );


            doc.setFillColor(...maroon);

            doc.roundedRect(
                margin,
                y,
                contentWidth *
                    (safeScore / 100),
                3,
                1.5,
                1.5,
                "F"
            );


            y += 10;

        }


        /* ==================================================
                REPORT COVER
        ================================================== */

        doc.setFillColor(...maroon);

        doc.rect(
            0,
            0,
            pageWidth,
            75,
            "F"
        );


        doc.setFont(
            "helvetica",
            "bold"
        );

        doc.setFontSize(28);

        doc.setTextColor(
            255,
            255,
            255
        );

        doc.text(
            "IdeaSphere",
            pageWidth / 2,
            30,
            {
                align: "center"
            }
        );


        doc.setFontSize(16);

        doc.text(
            "AI VALIDATION REPORT",
            pageWidth / 2,
            43,
            {
                align: "center"
            }
        );


        doc.setFont(
            "helvetica",
            "normal"
        );

        doc.setFontSize(10);

        doc.text(
            "Smart insights for smarter innovation.",
            pageWidth / 2,
            54,
            {
                align: "center"
            }
        );


        y = 95;


        doc.setFont(
            "helvetica",
            "bold"
        );

        doc.setFontSize(22);

        doc.setTextColor(...maroon);


        const titleLines =
            doc.splitTextToSize(

                idea.title ||
                "Untitled Idea",

                contentWidth

            );


        doc.text(
            titleLines,
            pageWidth / 2,
            y,
            {
                align: "center"
            }
        );


        y +=
            titleLines.length * 9 +
            7;


        doc.setFont(
            "helvetica",
            "normal"
        );

        doc.setFontSize(11);

        doc.setTextColor(...gray);

        doc.text(

            (idea.category || "General") +

            "  |  " +

            (idea.stage || "Idea"),

            pageWidth / 2,

            y,

            {
                align: "center"
            }

        );


        y += 25;


        const overall =
            normalizeScore(
                analysis.overall
            );


        doc.setDrawColor(...maroon);

        doc.setLineWidth(2);

        doc.circle(
            pageWidth / 2,
            y + 22,
            22
        );


        doc.setFont(
            "helvetica",
            "bold"
        );

        doc.setFontSize(24);

        doc.setTextColor(...maroon);

        doc.text(
            overall + "",
            pageWidth / 2,
            y + 20,
            {
                align: "center"
            }
        );


        doc.setFontSize(9);

        doc.text(
            "OUT OF 100",
            pageWidth / 2,
            y + 29,
            {
                align: "center"
            }
        );


        y += 58;


        doc.setFontSize(12);

        doc.text(
            getPotentialLabel(overall),
            pageWidth / 2,
            y,
            {
                align: "center"
            }
        );


        y += 20;


        /* ==================================================
                SCORE BREAKDOWN
        ================================================== */

        drawSectionTitle(
            "AI Score Breakdown"
        );


        drawScoreRow(
            "Innovation",
            analysis.innovation
        );


        drawScoreRow(
            "Market Demand",
            analysis.market
        );


        drawScoreRow(
            "Feasibility",
            analysis.feasibility
        );


        drawScoreRow(
            "Revenue Potential",
            analysis.revenue
        );


        y += 5;


        /* ==================================================
                SWOT ANALYSIS
        ================================================== */

        drawSectionTitle(
            "SWOT Analysis"
        );


        doc.setFont(
            "helvetica",
            "bold"
        );

        doc.setFontSize(12);

        doc.setTextColor(...maroon);

        doc.text(
            "Strengths",
            margin,
            y
        );

        y += 8;

        drawList(
            analysis.strengths
        );


        y += 4;


        doc.setFont(
            "helvetica",
            "bold"
        );

        doc.setFontSize(12);

        doc.setTextColor(...maroon);

        addPageIfNeeded(15);

        doc.text(
            "Weaknesses",
            margin,
            y
        );

        y += 8;

        drawList(
            analysis.weaknesses
        );


        y += 4;


        doc.setFont(
            "helvetica",
            "bold"
        );

        doc.setFontSize(12);

        doc.setTextColor(...maroon);

        addPageIfNeeded(15);

        doc.text(
            "Opportunities",
            margin,
            y
        );

        y += 8;

        drawList(
            analysis.opportunities
        );


        y += 4;


        doc.setFont(
            "helvetica",
            "bold"
        );

        doc.setFontSize(12);

        doc.setTextColor(...maroon);

        addPageIfNeeded(15);

        doc.text(
            "Threats",
            margin,
            y
        );

        y += 8;

        drawList(
            analysis.threats
        );


        y += 8;


        /* ==================================================
                AI RECOMMENDATIONS
        ================================================== */

        drawSectionTitle(
            "IdeaSphere AI Recommendations"
        );


        const suggestions =

            Array.isArray(
                analysis.suggestions
            )

                ? analysis.suggestions

                : [];


        suggestions.forEach(
            function (suggestion, index) {

                const number =

                    String(index + 1)
                        .padStart(2, "0");


                const lines =

                    doc.splitTextToSize(

                        String(suggestion),

                        contentWidth - 18

                    );


                const cardHeight =

                    Math.max(
                        15,
                        lines.length * 6 + 7
                    );


                addPageIfNeeded(
                    cardHeight + 5
                );


                doc.setFillColor(
                    248,
                    248,
                    248
                );


                doc.roundedRect(

                    margin,

                    y - 5,

                    contentWidth,

                    cardHeight,

                    3,

                    3,

                    "F"

                );


                doc.setFont(
                    "helvetica",
                    "bold"
                );

                doc.setFontSize(12);

                doc.setTextColor(...maroon);

                doc.text(
                    number,
                    margin + 5,
                    y + 4
                );


                doc.setFont(
                    "helvetica",
                    "normal"
                );

                doc.setFontSize(10.5);

                doc.setTextColor(...dark);

                doc.text(
                    lines,
                    margin + 18,
                    y + 3
                );


                y += cardHeight + 5;

            }
        );


        /* ==================================================
                FOOTER
        ================================================== */

        const totalPages =
            doc.getNumberOfPages();


        for (
            let page = 1;
            page <= totalPages;
            page++
        ) {

            doc.setPage(page);


            doc.setDrawColor(
                220,
                220,
                220
            );


            doc.line(

                margin,

                pageHeight - 16,

                pageWidth - margin,

                pageHeight - 16

            );


            doc.setFont(
                "helvetica",
                "normal"
            );

            doc.setFontSize(8);

            doc.setTextColor(...gray);


            doc.text(

                "Generated by IdeaSphere AI",

                margin,

                pageHeight - 9

            );


            doc.text(

                "Page " +
                page +
                " of " +
                totalPages,

                pageWidth - margin,

                pageHeight - 9,

                {
                    align: "right"
                }

            );

        }


        /* ==================================================
                DOWNLOAD PDF
        ================================================== */

        const safeFileName =

            String(
                idea.title ||
                "Idea"
            )

                .replace(
                    /[^a-z0-9]/gi,
                    "-"
                )

                .replace(
                    /-+/g,
                    "-"
                )

                .replace(
                    /^-|-$|/g,
                    ""
                );


        doc.save(

            "IdeaSphere-" +

            (safeFileName || "Idea") +

            "-AI-Report.pdf"

        );

    }


    /* ==================================================
            POTENTIAL LABEL
    ================================================== */

    function getPotentialLabel(score) {

        if (score >= 85) {

            return "EXCELLENT POTENTIAL";

        }


        if (score >= 70) {

            return "STRONG POTENTIAL";

        }


        if (score >= 55) {

            return "PROMISING POTENTIAL";

        }


        if (score >= 40) {

            return "NEEDS REFINEMENT";

        }


        return "HIGH RISK";

    }


    /* ==================================================
            ESCAPE HTML
    ================================================== */

    function escapeHTML(value) {

        return String(value)

            .replace(/&/g, "&amp;")

            .replace(/</g, "&lt;")

            .replace(/>/g, "&gt;")

            .replace(/"/g, "&quot;")

            .replace(/'/g, "&#039;");

    }


  /* ==================================================
        START VALIDATOR
================================================== */

loadIdeasFromBackend();

});