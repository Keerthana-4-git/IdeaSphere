const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const ideaRoutes = require("./routes/ideaRoutes");
const workspaceRoutes = require("./routes/workspaceRoutes");

const app = express();

/* ===========================================
        MIDDLEWARE
=========================================== */

app.use(
    cors({
        origin: "https://ideasphere-web.onrender.com",
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
        credentials: false
    })
);

app.options("*", cors({
    origin: "https://ideasphere-web.onrender.com",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: false
}));

/* ===========================================
        ROUTES
=========================================== */

app.use("/api/auth", authRoutes);

app.use("/api/ideas", ideaRoutes);

app.use("/api/workspaces", workspaceRoutes);

/* ===========================================
        HOME
=========================================== */

app.get("/", (req, res) => {

    res.json({

        success: true,

        message: "IdeaSphere Backend Running 🚀"

    });

});

/* ===========================================
        HEALTH
=========================================== */

app.get("/api/health", (req, res) => {

    res.json({

        success: true,

        status: "running"

    });

});

module.exports = app;