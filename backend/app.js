const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const ideaRoutes = require("./routes/ideaRoutes");

const app = express();

/* ===========================================
        MIDDLEWARE
=========================================== */

app.use(cors());

app.use(
    express.json({
        limit: "1mb"
    })
);

/* ===========================================
        ROUTES
=========================================== */

app.use("/api/auth", authRoutes);

app.use("/api/ideas", ideaRoutes);

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