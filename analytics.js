/* ==================================================
        IDEASPHERE ANALYTICS
================================================== */

document.addEventListener("DOMContentLoaded", async function () {


    /* ==================================================
            LOAD IDEAS
    ================================================== */

    const response = await getIdeas();

const ideas =
    response.success && Array.isArray(response.ideas)
        ? response.ideas
        : [];


    /* ==================================================
            GET VALIDATED IDEAS
    ================================================== */

    const validatedIdeas = ideas.filter(function (idea) {

        return (
            idea.aiAnalysis &&
            typeof idea.aiAnalysis === "object"
        );

    });


    /* ==================================================
            DOM ELEMENTS
    ================================================== */

    const totalIdeasElement =
        document.getElementById("totalIdeas");

    const validatedIdeasElement =
        document.getElementById("validatedIdeas");

    const averageScoreElement =
        document.getElementById("averageScore");

    const strongestIdeaElement =
        document.getElementById("strongestIdea");

    const ideaComparison =
        document.getElementById("ideaComparison");

    const recentValidations =
        document.getElementById("recentValidations");

    const validateIdeaBtn =
        document.getElementById("validateIdeaBtn");

    const openTopIdeaBtn =
        document.getElementById("openTopIdeaBtn");


    /* ==================================================
            CALCULATE OVERVIEW
    ================================================== */

    const totalIdeas = ideas.length;

    const validatedCount = validatedIdeas.length;

    const pendingCount = Math.max(
        0,
        totalIdeas - validatedCount
    );


    const averageScore = calculateAverage(

        validatedIdeas.map(function (idea) {

            return getScore(
                idea.aiAnalysis.overall
            );

        })

    );


    /* ==================================================
            SORT VALIDATED IDEAS BY SCORE
    ================================================== */

    const ideasByScore = [...validatedIdeas].sort(
        function (firstIdea, secondIdea) {

            return (
                getScore(secondIdea.aiAnalysis.overall) -
                getScore(firstIdea.aiAnalysis.overall)
            );

        }
    );


    const topIdea =
        ideasByScore.length > 0
            ? ideasByScore[0]
            : null;


    /* ==================================================
            DISPLAY OVERVIEW
    ================================================== */

    if (totalIdeasElement) {

        totalIdeasElement.textContent =
            totalIdeas;

    }


    if (validatedIdeasElement) {

        validatedIdeasElement.textContent =
            validatedCount;

    }


    if (averageScoreElement) {

        averageScoreElement.textContent =
            averageScore + "%";

    }


    if (strongestIdeaElement) {

        strongestIdeaElement.textContent =
            topIdea
                ? topIdea.title || "Untitled Idea"
                : "—";

    }


    /* ==================================================
            CALCULATE PERFORMANCE AVERAGES
    ================================================== */

    const averageInnovation =
        calculateMetricAverage("innovation");

    const averageMarket =
        calculateMetricAverage("market");

    const averageFeasibility =
        calculateMetricAverage("feasibility");

    const averageRevenue =
        calculateMetricAverage("revenue");


    displayMetric(
        "averageInnovation",
        "innovationBar",
        averageInnovation
    );


    displayMetric(
        "averageMarket",
        "marketBar",
        averageMarket
    );


    displayMetric(
        "averageFeasibility",
        "feasibilityBar",
        averageFeasibility
    );


    displayMetric(
        "averageRevenue",
        "revenueBar",
        averageRevenue
    );


    /* ==================================================
            DISPLAY VALIDATION STATUS
    ================================================== */

    const validatedStatusCount =
        document.getElementById(
            "validatedStatusCount"
        );

    const pendingStatusCount =
        document.getElementById(
            "pendingStatusCount"
        );

    const validationPercentageElement =
        document.getElementById(
            "validationPercentage"
        );

    const validationProgressBar =
        document.getElementById(
            "validationProgressBar"
        );


    if (validatedStatusCount) {

        validatedStatusCount.textContent =
            validatedCount;

    }


    if (pendingStatusCount) {

        pendingStatusCount.textContent =
            pendingCount;

    }


    const validationPercentage =
        totalIdeas > 0
            ? Math.round(
                (validatedCount / totalIdeas) * 100
            )
            : 0;


    if (validationPercentageElement) {

        validationPercentageElement.textContent =
            validationPercentage + "%";

    }


    setTimeout(function () {

        if (validationProgressBar) {

            validationProgressBar.style.width =
                validationPercentage + "%";

        }

    }, 200);


    /* ==================================================
            RENDER ANALYTICS
    ================================================== */

    renderIdeaComparison();

    renderTopIdea();

    renderRecentValidations();


    /* ==================================================
            CALCULATE METRIC AVERAGE
    ================================================== */

    function calculateMetricAverage(metric) {

        const scores = validatedIdeas.map(
            function (idea) {

                return getScore(
                    idea.aiAnalysis[metric]
                );

            }
        );


        return calculateAverage(scores);

    }


    /* ==================================================
            CALCULATE AVERAGE
    ================================================== */

    function calculateAverage(numbers) {

        if (
            !Array.isArray(numbers) ||
            numbers.length === 0
        ) {

            return 0;

        }


        const total = numbers.reduce(
            function (sum, number) {

                return sum + getScore(number);

            },
            0
        );


        return Math.round(
            total / numbers.length
        );

    }


    /* ==================================================
            DISPLAY PERFORMANCE METRIC
    ================================================== */

    function displayMetric(
        textId,
        barId,
        score
    ) {

        const safeScore = getScore(score);

        const textElement =
            document.getElementById(textId);

        const barElement =
            document.getElementById(barId);


        if (textElement) {

            textElement.textContent =
                safeScore + "%";

        }


        setTimeout(function () {

            if (barElement) {

                barElement.style.width =
                    safeScore + "%";

            }

        }, 200);

    }


    /* ==================================================
            RENDER IDEA COMPARISON
    ================================================== */

    function renderIdeaComparison() {

        if (!ideaComparison) {

            return;

        }


        ideaComparison.innerHTML = "";


        if (validatedIdeas.length === 0) {

            ideaComparison.innerHTML = `

                <div class="analytics-empty-state">

                    <i class="fa-solid fa-chart-line"></i>

                    <h3>No AI Analytics Yet</h3>

                    <p>
                        Validate your ideas with IdeaSphere AI
                        to compare their performance.
                    </p>

                </div>

            `;


            return;

        }


        ideasByScore.forEach(
            function (idea, index) {

                const score = getScore(
                    idea.aiAnalysis.overall
                );


                const item =
                    document.createElement("div");


                item.className =
                    "comparison-item";


                item.innerHTML = `

                    <div class="comparison-info">

                        <h3>
                            ${escapeHTML(
                                idea.title ||
                                "Untitled Idea"
                            )}
                        </h3>

                        <p>
                            ${escapeHTML(
                                idea.category ||
                                "General"
                            )}

                            • Rank ${index + 1}
                        </p>

                    </div>


                    <div class="comparison-progress">

                        <div
                            class="comparison-progress-bar"
                            data-score="${score}">
                        </div>

                    </div>


                    <div class="comparison-score">

                        ${score}%

                    </div>

                `;


                item.addEventListener(
                    "click",
                    function () {

                        openProject(idea);

                    }
                );


                ideaComparison.appendChild(item);

            }
        );


        setTimeout(function () {

            const bars =
                document.querySelectorAll(
                    ".comparison-progress-bar"
                );


            bars.forEach(function (bar) {

                bar.style.width =
                    getScore(
                        bar.dataset.score
                    ) + "%";

            });

        }, 250);

    }


    /* ==================================================
            RENDER TOP IDEA
    ================================================== */

    function renderTopIdea() {

        const topIdeaTitle =
            document.getElementById(
                "topIdeaTitle"
            );

        const topIdeaCategory =
            document.getElementById(
                "topIdeaCategory"
            );

        const topIdeaScore =
            document.getElementById(
                "topIdeaScore"
            );

        const topIdeaPotential =
            document.getElementById(
                "topIdeaPotential"
            );


        if (
            !topIdeaTitle ||
            !topIdeaCategory ||
            !topIdeaScore ||
            !topIdeaPotential
        ) {

            return;

        }


        if (!topIdea) {

            topIdeaTitle.textContent =
                "No validated ideas yet";


            topIdeaCategory.textContent =
                "Validate an idea to discover your strongest concept.";


            topIdeaScore.textContent =
                "0%";


            topIdeaPotential.textContent =
                "Awaiting AI Analysis";


            if (openTopIdeaBtn) {

                openTopIdeaBtn.disabled = true;

                openTopIdeaBtn.style.opacity = ".6";

                openTopIdeaBtn.style.cursor =
                    "not-allowed";

            }


            return;

        }


        const score = getScore(
            topIdea.aiAnalysis.overall
        );


        topIdeaTitle.textContent =
            topIdea.title ||
            "Untitled Idea";


        topIdeaCategory.textContent =
            (topIdea.category || "General") +
            " • " +
            (topIdea.stage || "Idea");


        topIdeaScore.textContent =
            score + "%";


        topIdeaPotential.textContent =
            getPotentialLabel(score);


        if (openTopIdeaBtn) {

            openTopIdeaBtn.disabled = false;

            openTopIdeaBtn.style.opacity = "1";

            openTopIdeaBtn.style.cursor =
                "pointer";


            openTopIdeaBtn.addEventListener(
                "click",
                function () {

                    openProject(topIdea);

                }
            );

        }

    }


    /* ==================================================
            RENDER RECENT VALIDATIONS
    ================================================== */

    function renderRecentValidations() {

        if (!recentValidations) {

            return;

        }


        recentValidations.innerHTML = "";


        if (validatedIdeas.length === 0) {

            recentValidations.innerHTML = `

                <div class="analytics-empty-state">

                    <i class="fa-solid fa-robot"></i>

                    <h3>No Recent Validations</h3>

                    <p>
                        Your AI validation history
                        will appear here.
                    </p>

                </div>

            `;


            return;

        }


        const recentIdeas = [...validatedIdeas]

            .sort(
                function (
                    firstIdea,
                    secondIdea
                ) {

                    return (
                        getValidationTime(secondIdea) -
                        getValidationTime(firstIdea)
                    );

                }
            )

            .slice(0, 6);


        recentIdeas.forEach(function (idea) {

            const score = getScore(
                idea.aiAnalysis.overall
            );


            const item =
                document.createElement("div");


            item.className =
                "validation-item";


            item.innerHTML = `

                <div class="validation-idea-info">

                    <h3>
                        ${escapeHTML(
                            idea.title ||
                            "Untitled Idea"
                        )}
                    </h3>

                    <p>
                        ${escapeHTML(
                            idea.category ||
                            "General"
                        )}

                        • ${escapeHTML(
                            getPotentialLabel(score)
                        )}
                    </p>

                </div>


                <span class="validation-date">

                    ${escapeHTML(
                        formatValidationDate(
                            idea.lastValidatedAt
                        )
                    )}

                </span>


                <span class="validation-score">

                    ${score}%

                </span>

            `;


            item.addEventListener(
                "click",
                function () {

                    openProject(idea);

                }
            );


            recentValidations.appendChild(item);

        });

    }


    /* ==================================================
            GET VALIDATION TIME
    ================================================== */

    function getValidationTime(idea) {

        if (!idea.lastValidatedAt) {

            return 0;

        }


        const time = new Date(
            idea.lastValidatedAt
        ).getTime();


        return Number.isNaN(time)
            ? 0
            : time;

    }


    /* ==================================================
            FORMAT VALIDATION DATE
    ================================================== */

    function formatValidationDate(dateValue) {

        if (!dateValue) {

            return "Recently";

        }


        const validationDate =
            new Date(dateValue);


        if (
            Number.isNaN(
                validationDate.getTime()
            )
        ) {

            return "Recently";

        }


        const now = new Date();


        const difference =
            now.getTime() -
            validationDate.getTime();


        const oneDay =
            24 * 60 * 60 * 1000;


        if (
            difference >= 0 &&
            difference < oneDay
        ) {

            return "Today";

        }


        if (
            difference >= oneDay &&
            difference < oneDay * 2
        ) {

            return "Yesterday";

        }


        return validationDate.toLocaleDateString(
            "en-IN",
            {
                day: "numeric",
                month: "short",
                year: "numeric"
            }
        );

    }


    /* ==================================================
            OPEN PROJECT
    ================================================== */

    function openProject(idea) {

        if (!idea) {

            return;

        }


        localStorage.setItem(
    "selectedIdeaId",
    String(idea._id || idea.id)
);


        window.location.href =
            "project-details.html";

    }


    /* ==================================================
            VALIDATE IDEA BUTTON
    ================================================== */

    if (validateIdeaBtn) {

        validateIdeaBtn.addEventListener(
            "click",
            function () {

                window.location.href =
                    "ai-validator.html";

            }
        );

    }


    /* ==================================================
            GET SAFE SCORE
    ================================================== */

    function getScore(score) {

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
            GET POTENTIAL LABEL
    ================================================== */

    function getPotentialLabel(score) {

        const safeScore =
            getScore(score);


        if (safeScore >= 85) {

            return "Excellent Potential";

        }


        if (safeScore >= 70) {

            return "Strong Potential";

        }


        if (safeScore >= 55) {

            return "Promising Potential";

        }


        if (safeScore >= 40) {

            return "Needs Refinement";

        }


        return "High Risk";

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


});

