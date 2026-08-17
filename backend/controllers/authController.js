const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const crypto = require("crypto");
const nodemailer = require("nodemailer");

/* =====================================
        REGISTER USER
===================================== */

const registerUser = async (req, res) => {
    try {

        const { fullName, email, password } = req.body;

        if (!fullName || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please fill all fields."
            });
        }

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "Email already registered."
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            fullName,
            email,
            password: hashedPassword
        });

        res.status(201).json({
            success: true,
            message: "User registered successfully.",
            user
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

/* =====================================
LOGIN USER
===================================== */

const loginUser = async (req, res) => {
    try {

        const { email, password } = req.body;

        console.log("LOGIN STEP 1: Finding user...");

        const user = await User.findOne({ email });

        console.log(
            "LOGIN STEP 2: User found:",
            user ? "YES" : "NO"
        );

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found."
            });
        }

        console.log("LOGIN STEP 3: Comparing password...");

        const isMatch = await bcrypt.compare(
            password,
            user.password
        );

        console.log(
            "LOGIN STEP 4: Password match:",
            isMatch
        );

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid password."
            });
        }

        console.log("LOGIN STEP 5: Creating JWT...");

        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            {
                expiresIn: "7d"
            }
        );

        console.log("LOGIN STEP 6: Login successful!");

        res.json({
            success: true,
            token,
            user
        });

    }

    catch (error) {

        console.error("LOGIN ERROR:", error);

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

/* =====================================
FORGOT PASSWORD
===================================== */

const forgotPassword = async (req, res) => {

    try {

        const { email } = req.body;

        if (!email) {

            return res.status(400).json({

                success: false,
                message: "Please enter your email."

            });

        }


        const user = await User.findOne({
            email: email.toLowerCase().trim()
        });


        /*
        Security:
        Don't reveal whether an email
        exists in the database.
        */

        if (!user) {

            return res.json({

                success: true,
                message:
                    "If an account exists with this email, a reset link has been sent."

            });

        }


        /* ---------- CREATE RESET TOKEN ---------- */

        const resetToken =
            crypto.randomBytes(32).toString("hex");


        const hashedToken =
            crypto
                .createHash("sha256")
                .update(resetToken)
                .digest("hex");


       user.resetPasswordToken = hashedToken;

user.resetPasswordExpires =
    Date.now() + 15 * 60 * 1000;

console.log("1️⃣ RESET TOKEN CREATED");
console.log("2️⃣ SAVING USER...");

await user.save();

console.log("3️⃣ USER SAVED SUCCESSFULLY");


        /* ---------- EMAIL ---------- */

        const transporter =
            nodemailer.createTransport({

                service: "gmail",

                auth: {

                    user: process.env.EMAIL_USER,

                    pass: process.env.EMAIL_PASS

                }

            });


       const resetLink =
    `http://10.177.207.75:5500/reset-password.html?token=${resetToken}`;

    
console.log("4️⃣ SMTP TRANSPORTER CREATED");
console.log("5️⃣ SENDING RESET EMAIL...");

        await transporter.sendMail({

            from: `"IdeaSphere" <${process.env.EMAIL_USER}>`,

            to: user.email,

            subject: "IdeaSphere Password Reset",

            html: `

                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">

                    <h2 style="color:#8f0d16;">
                        IdeaSphere Password Reset
                    </h2>

                    <p>
                        Hi ${user.fullName},
                    </p>

                    <p>
                        We received a request to reset your IdeaSphere password.
                    </p>

                    <p>
                        Click the button below to create a new password.
                    </p>

                    <a
                        href="${resetLink}"
                        style="
                            display:inline-block;
                            padding:12px 22px;
                            background:#8f0d16;
                            color:white;
                            text-decoration:none;
                            border-radius:8px;
                            font-weight:bold;
                        "
                    >
                        Reset My Password
                    </a>

                    <p style="margin-top:25px;">
                        This link will expire in 15 minutes.
                    </p>

                    <p>
                        If you did not request this, you can safely ignore this email.
                    </p>

                    <p>
                        — IdeaSphere Team
                    </p>

                </div>

            `

        });

console.log("6️⃣ RESET EMAIL SENT SUCCESSFULLY");

        res.json({

            success: true,

            message:
                "If an account exists with this email, a reset link has been sent."

        });


    } catch (error) {

        console.error(
            "Forgot Password Error:",
            error
        );

        res.status(500).json({

            success: false,

            message:
                "Unable to process password reset."

        });

    }

};


/* =====================================
RESET PASSWORD
===================================== */

const resetPassword = async (req, res) => {

    try {

        const {
            token,
            password
        } = req.body;


        if (!token || !password) {

            return res.status(400).json({

                success: false,

                message:
                    "Token and new password are required."

            });

        }


        if (password.length < 6) {

            return res.status(400).json({

                success: false,

                message:
                    "Password must be at least 6 characters."

            });

        }


        /* ---------- HASH TOKEN ---------- */

        const hashedToken =
            crypto
                .createHash("sha256")
                .update(token)
                .digest("hex");


        /* ---------- FIND USER ---------- */

        const user = await User.findOne({

            resetPasswordToken: hashedToken,

            resetPasswordExpires: {
                $gt: Date.now()
            }

        });


        if (!user) {

            return res.status(400).json({

                success: false,

                message:
                    "Reset link is invalid or has expired."

            });

        }


        /* ---------- UPDATE PASSWORD ---------- */

        user.password =
            await bcrypt.hash(password, 10);


        /* ---------- CLEAR RESET TOKEN ---------- */

        user.resetPasswordToken = null;

        user.resetPasswordExpires = null;


        await user.save();


        res.json({

            success: true,

            message:
                "Password reset successfully."

        });


    } catch (error) {

        console.error(
            "Reset Password Error:",
            error
        );

        res.status(500).json({

            success: false,

            message:
                "Unable to reset password."

        });

    }

};

/* ==========================================
        UPDATE PROFILE
========================================== */

const updateProfile = async (req, res) => {

    try {

        const userId =
            req.user._id ||
            req.user.id;


        const {
            fullName,
            username,
            bio
        } = req.body;


        const user =
            await User.findById(userId);


        if (!user) {

            return res.status(404).json({

                success: false,

                message:
                    "User not found."

            });

        }


        if (fullName !== undefined) {

            user.fullName =
                fullName.trim();

        }


        if (username !== undefined) {

            user.username =
                username.trim();

        }


        if (bio !== undefined) {

            user.bio =
                bio.trim();

        }


        await user.save();


        res.status(200).json({

            success: true,

            message:
                "Profile updated successfully.",

            user

        });

    }

    catch (error) {

        console.error(
            "Update Profile Error:",
            error
        );


        res.status(500).json({

            success: false,

            message:
                "Unable to update profile."

        });

    }

};

module.exports = {

    registerUser,

    loginUser,

    forgotPassword,

    resetPassword,

    updateProfile

};