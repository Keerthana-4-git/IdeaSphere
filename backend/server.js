/* ==================================================
        IDEASPHERE AI BACKEND
================================================== */

require("dotenv").config();


const express = require("express");
const cors = require("cors");
const { GoogleGenAI } = require("@google/genai");
const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const ideaRoutes = require("./routes/ideaRoutes");
const workspaceRoutes = require("./routes/workspaceRoutes");    
const invitationRoutes =
    require("./routes/invitationRoutes");
const savedExploreRoutes =
    require("./routes/savedExploreRoutes");


const authMiddleware = require("./middleware/authMiddleware");

const {
    saveIdea
} = require("./controllers/ideaController");

/* ==================================================
        CREATE EXPRESS APP
================================================== */

const app = express();


/* ==================================================
        SERVER CONFIGURATION
================================================== */

const PORT = process.env.PORT || 5000;

/*
    PRIMARY MODEL

    Gemini 3.1 Flash-Lite is used first because
    IdeaSphere validation is a structured JSON task
    where speed is important.
*/

const PRIMARY_MODEL = "gemini-3.1-flash-lite";

/*
    FALLBACK MODEL

    If Flash-Lite is temporarily unavailable,
    IdeaSphere automatically tries Gemini 3.5 Flash.
*/

const FALLBACK_MODEL = "gemini-3.5-flash";

const MAX_RETRIES = 2;

const REQUEST_TIMEOUT = 45000;


/* ==================================================
        MIDDLEWARE
================================================== */


app.use(cors());

app.use(
    express.json({
        limit: "1mb"
    })
);

app.use("/api/auth", authRoutes);

app.use("/api/ideas", ideaRoutes);

app.use("/api/workspaces", workspaceRoutes);

app.use(
    "/api/invitations",
    invitationRoutes
);

app.use(
    "/api/explore-saved",
    savedExploreRoutes
);

/* ==================================================
        SAVE IDEA DIRECT ROUTE
================================================== */

app.post(
    "/api/ideas/:id/save",
    authMiddleware,
    saveIdea
);


app.get("/hello", (req, res) => {
    res.send("HELLO IDEASPHERE");
});



/* ==================================================
        CHECK GEMINI API KEY
================================================== */

if (!process.env.GEMINI_API_KEY) {

    console.error("");
    console.error("❌ GEMINI_API_KEY is missing.");
    console.error("Please check backend/.env");
    console.error("");

    process.exit(1);

}


/* ==================================================
        CREATE GEMINI CLIENT
================================================== */

const ai = new GoogleGenAI({

    apiKey: process.env.GEMINI_API_KEY

});


/* ==================================================
        RESPONSE JSON SCHEMA
================================================== */

const analysisSchema = {

    type: "object",

    properties: {

        innovation: {

            type: "integer"

        },

        market: {

            type: "integer"

        },

        feasibility: {

            type: "integer"

        },

        revenue: {

            type: "integer"

        },

        strengths: {

            type: "array",

            items: {

                type: "string"

            }

        },

        weaknesses: {

            type: "array",

            items: {

                type: "string"

            }

        },

        opportunities: {

            type: "array",

            items: {

                type: "string"

            }

        },

        threats: {

            type: "array",

            items: {

                type: "string"

            }

        },

        suggestions: {

            type: "array",

            items: {

                type: "string"

            }

        }

    },

    required: [

        "innovation",

        "market",

        "feasibility",

        "revenue",

        "strengths",

        "weaknesses",

        "opportunities",

        "threats",

        "suggestions"

    ]

};


/* ==================================================
        HOME ROUTE
================================================== */

app.get("/", function (req, res) {

    res.json({

        success: true,

        message:
            "IdeaSphere AI Backend is running 🤖",

        primaryModel:
            PRIMARY_MODEL,

        fallbackModel:
            FALLBACK_MODEL

    });

});


/* ==================================================
        HEALTH ROUTE
================================================== */

app.get("/api/health", function (req, res) {

    res.json({

        success: true,

        service:
            "IdeaSphere AI",

        status:
            "running",

        primaryModel:
            PRIMARY_MODEL,

        fallbackModel:
            FALLBACK_MODEL,

        retrySystem:
            "enabled"

    });

});


/* ==================================================
        VALIDATE IDEA ROUTE
================================================== */

app.post(
    "/api/validate-idea",

    async function (req, res) {

        const requestStartedAt = Date.now();

        try {

            /* ==================================================
                    GET IDEA
            ================================================== */

            const idea = req.body.idea;


            /* ==================================================
                    VALIDATE IDEA
            ================================================== */

            if (
                !idea ||
                typeof idea !== "object"
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Idea data is required."

                });

            }


            if (
                !idea.title ||
                String(idea.title).trim() === ""
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Idea title is required."

                });

            }


            /* ==================================================
                    CLEAN IDEA DATA
            ================================================== */

            const cleanIdea = {

                title: cleanText(
                    idea.title,
                    200
                ),

                category: cleanText(
                    idea.category || "General",
                    100
                ),

                problem: cleanText(
                    idea.problem || "Not provided",
                    2000
                ),

                solution: cleanText(
                    idea.solution || "Not provided",
                    2000
                ),

                targetUsers: cleanText(

                    idea.targetUsers ||

                    idea.targetAudience ||

                    idea.audience ||

                    "Not provided",

                    800

                ),

                priority: cleanText(
                    idea.priority || "Medium",
                    100
                ),

                stage: cleanText(
                    idea.stage || "Idea",
                    100
                )

            };


            /* ==================================================
                    CREATE COMPACT AI PROMPT
            ================================================== */

            const prompt = `

You are IdeaSphere AI, a startup idea validation analyst.

Analyze this startup idea objectively and specifically.

IDEA TITLE:
${cleanIdea.title}

CATEGORY:
${cleanIdea.category}

PROBLEM:
${cleanIdea.problem}

SOLUTION:
${cleanIdea.solution}

TARGET USERS:
${cleanIdea.targetUsers}

PRIORITY:
${cleanIdea.priority}

STAGE:
${cleanIdea.stage}

Evaluate four dimensions from 0 to 100.

innovation:
Originality, differentiation and value proposition.

market:
Problem seriousness, audience and adoption potential.

feasibility:
Technical complexity, resources and realistic MVP execution.

revenue:
Monetization, scalability and sustainable revenue potential.

SCORING:

0-39 = Weak
40-59 = Significant improvement required
60-74 = Promising but requires validation
75-89 = Strong potential
90-100 = Exceptional and rare

Do not inflate scores.

Scores above 90 must be rare and strongly justified.

Provide exactly:

3 specific strengths
3 specific weaknesses
3 specific opportunities
3 specific threats
6 concise actionable suggestions

All SWOT points and suggestions must directly relate to this idea.

Return only valid JSON.

            `;


            /* ==================================================
                    START ANALYSIS
            ================================================== */

            console.log("");

            console.log(
                "=========================================="
            );

            console.log(
                `🤖 ANALYZING: ${cleanIdea.title}`
            );

            console.log(
                "⚡ FAST VALIDATION STARTED"
            );

            console.log(
                "=========================================="
            );


            /* ==================================================
                    CALL GEMINI WITH FALLBACK
            ================================================== */

            const result =
                await generateWithFallback(
                    prompt
                );


            const analysis =
                result.analysis;


            /* ==================================================
                    NORMALIZE SCORES
            ================================================== */

            analysis.innovation =
                normalizeScore(
                    analysis.innovation
                );

            analysis.market =
                normalizeScore(
                    analysis.market
                );

            analysis.feasibility =
                normalizeScore(
                    analysis.feasibility
                );

            analysis.revenue =
                normalizeScore(
                    analysis.revenue
                );


            /* ==================================================
                    CALCULATE OVERALL SCORE
            ================================================== */

            analysis.overall =
                Math.round(

                    (

                        analysis.innovation +

                        analysis.market +

                        analysis.feasibility +

                        analysis.revenue

                    ) / 4

                );


            /* ==================================================
                    NORMALIZE LISTS
            ================================================== */

            analysis.strengths =
                normalizeList(
                    analysis.strengths,
                    3
                );

            analysis.weaknesses =
                normalizeList(
                    analysis.weaknesses,
                    3
                );

            analysis.opportunities =
                normalizeList(
                    analysis.opportunities,
                    3
                );

            analysis.threats =
                normalizeList(
                    analysis.threats,
                    3
                );

            analysis.suggestions =
                normalizeList(
                    analysis.suggestions,
                    6
                );


            /* ==================================================
                    METADATA
            ================================================== */

            const processingTime =
                Date.now() - requestStartedAt;


            analysis.generatedAt =
                new Date().toISOString();

            analysis.model =
                result.model;

            analysis.processingTimeMs =
                processingTime;


            /* ==================================================
                    SUCCESS LOG
            ================================================== */

            console.log("");

            console.log(
                "✅ IDEASPHERE AI ANALYSIS SUCCESS"
            );

            console.log(
                `🧠 MODEL USED: ${result.model}`
            );

            console.log(
                `⭐ OVERALL SCORE: ${analysis.overall}%`
            );

            console.log(
                `⚡ PROCESSING TIME: ${processingTime}ms`
            );

            console.log(
                "=========================================="
            );

            console.log("");


            /* ==================================================
                    SEND RESPONSE
            ================================================== */

            return res.json({

                success: true,

                ideaTitle:
                    cleanIdea.title,

                analysis:
                    analysis

            });

        }


        /* ==================================================
                ERROR HANDLER
        ================================================== */

        catch (error) {

            const processingTime =
                Date.now() - requestStartedAt;


            const errorMessage =

                error &&
                error.message

                    ? error.message

                    : String(error);


            console.error("");

            console.error(
                "❌ IDEASPHERE AI REQUEST FAILED"
            );

            console.error(
                `⏱ FAILED AFTER: ${processingTime}ms`
            );

            console.error(
                errorMessage
            );

            console.error("");


            return res.status(503).json({

                success: false,

                message:
                    "IdeaSphere AI is temporarily busy. Please try again in a moment.",

                error:
                    "AI_SERVICE_TEMPORARILY_UNAVAILABLE"

            });

        }

    }

);


/* ==================================================
        GENERATE WITH MODEL FALLBACK
================================================== */

async function generateWithFallback(prompt) {

    const models = [

        PRIMARY_MODEL,

        FALLBACK_MODEL

    ];


    let lastError = null;


    for (const model of models) {

        console.log("");

        console.log(
            `🧠 TRYING MODEL: ${model}`
        );


        try {

            const response =
                await generateWithRetry(
                    model,
                    prompt
                );


            if (
                !response ||
                !response.text
            ) {

                throw new Error(
                    "Gemini returned an empty response."
                );

            }


            const analysis =
                JSON.parse(
                    response.text
                );


            return {

                model:
                    model,

                analysis:
                    analysis

            };

        }

        catch (error) {

            lastError =
                error;


            console.warn(
                `⚠ MODEL FAILED: ${model}`
            );


            console.warn(
                getErrorMessage(error)
            );


            if (
                !isTransientError(error)
            ) {

                throw error;

            }


            console.warn(
                "🔄 SWITCHING TO NEXT MODEL..."
            );

        }

    }


    throw (
        lastError ||

        new Error(
            "All Gemini models are unavailable."
        )
    );

}


/* ==================================================
        GENERATE WITH RETRY
================================================== */

async function generateWithRetry(
    model,
    prompt
) {

    let lastError = null;


    for (
        let attempt = 0;
        attempt <= MAX_RETRIES;
        attempt++
    ) {

        try {

            console.log(
                `⚡ ${model} | Attempt ${attempt + 1}`
            );


            const response =
                await withTimeout(

                    ai.models.generateContent({

                        model:
                            model,

                        contents:
                            prompt,

                        config: {

                            temperature:
                                0.3,

                            maxOutputTokens:
                                1500,

                            responseMimeType:
                                "application/json",

                            responseJsonSchema:
                                analysisSchema

                        }

                    }),

                    REQUEST_TIMEOUT

                );


            return response;

        }

        catch (error) {

            lastError =
                error;


            if (
                !isTransientError(error)
            ) {

                throw error;

            }


            if (
                attempt === MAX_RETRIES
            ) {

                break;

            }


            const delay =
                calculateRetryDelay(
                    attempt
                );


            console.warn(
                `⏳ Temporary Gemini error. Retrying in ${delay}ms...`
            );


            await sleep(
                delay
            );

        }

    }


    throw lastError;

}


/* ==================================================
        CHECK TRANSIENT ERROR
================================================== */

function isTransientError(error) {

    const message =
        getErrorMessage(error)
            .toLowerCase();


    const status =

        Number(
            error &&
            (
                error.status ||

                error.code ||

                (
                    error.response &&
                    error.response.status
                )
            )
        );


    return (

        status === 408 ||

        status === 429 ||

        status === 500 ||

        status === 502 ||

        status === 503 ||

        status === 504 ||

        message.includes("503") ||

        message.includes("429") ||

        message.includes("unavailable") ||

        message.includes("high demand") ||

        message.includes("overloaded") ||

        message.includes("resource_exhausted") ||

        message.includes("timeout") ||

        message.includes("timed out") ||

        message.includes("fetch failed")

    );

}


/* ==================================================
        RETRY DELAY WITH JITTER
================================================== */

function calculateRetryDelay(attempt) {

    const baseDelay =
        700 * Math.pow(
            2,
            attempt
        );


    const jitter =
        Math.floor(
            Math.random() * 400
        );


    return (
        baseDelay +
        jitter
    );

}


/* ==================================================
        REQUEST TIMEOUT
================================================== */

function withTimeout(
    promise,
    milliseconds
) {

    let timeoutId;


    const timeoutPromise =
        new Promise(
            function (_, reject) {

                timeoutId =
                    setTimeout(
                        function () {

                            reject(
                                new Error(
                                    "Gemini request timed out."
                                )
                            );

                        },

                        milliseconds

                    );

            }
        );


    return Promise.race([

        promise,

        timeoutPromise

    ])

        .finally(
            function () {

                clearTimeout(
                    timeoutId
                );

            }
        );

}


/* ==================================================
        SLEEP
================================================== */

function sleep(milliseconds) {

    return new Promise(
        function (resolve) {

            setTimeout(
                resolve,
                milliseconds
            );

        }
    );

}


/* ==================================================
        GET ERROR MESSAGE
================================================== */

function getErrorMessage(error) {

    if (
        error &&
        error.message
    ) {

        return String(
            error.message
        );

    }


    return String(
        error
    );

}


/* ==================================================
        NORMALIZE SCORE
================================================== */

function normalizeScore(score) {

    const number =
        Number(score);


    if (
        Number.isNaN(number)
    ) {

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
        NORMALIZE LIST
================================================== */

function normalizeList(
    data,
    limit
) {

    if (
        !Array.isArray(data)
    ) {

        return [];

    }


    return data

        .filter(
            function (item) {

                return (

                    typeof item === "string" &&

                    item.trim() !== ""

                );

            }
        )

        .map(
            function (item) {

                return item.trim();

            }
        )

        .slice(
            0,
            limit
        );

}


/* ==================================================
        CLEAN TEXT
================================================== */

function cleanText(
    value,
    maximumLength
) {

    return String(value)

        .trim()

        .slice(
            0,
            maximumLength
        );

}


/* ==================================================
        API 404
================================================== */

app.use(
    "/api",

    function (req, res) {

        res.status(404).json({

            success: false,

            message:
                "IdeaSphere API route not found."

        });

    }

);


/* ==================================================
        START SERVER
================================================== */
connectDB();


console.log(
  app._router?.stack
    ?.filter(layer => layer.route)
    .map(layer => ({
      path: layer.route.path,
      methods: layer.route.methods
    }))
);


app.listen(
    PORT,

    function () {

        console.log("");

        console.log(
            "=========================================="
        );

        console.log(
            "🤖 IDEASPHERE AI BACKEND"
        );

        console.log(
            "=========================================="
        );

        console.log(
            `🚀 PORT: ${PORT}`
        );

        console.log(
            `⚡ PRIMARY MODEL: ${PRIMARY_MODEL}`
        );

        console.log(
            `🛡 FALLBACK MODEL: ${FALLBACK_MODEL}`
        );

        console.log(
            `🔄 RETRIES PER MODEL: ${MAX_RETRIES}`
        );

        console.log(
            "🔐 API KEY: LOADED"
        );

        console.log(
            "=========================================="
        );

        console.log("");

    }

);