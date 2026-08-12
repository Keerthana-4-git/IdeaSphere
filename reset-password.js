/* ==========================================
   IDEASPHERE - RESET PASSWORD
========================================== */


/* ==========================================
   GET ELEMENTS
========================================== */

const form =
    document.getElementById(
        "resetPasswordForm"
    );

const password =
    document.getElementById(
        "password"
    );

const confirmPassword =
    document.getElementById(
        "confirmPassword"
    );


/* ==========================================
   GET RESET TOKEN
========================================== */

const urlParams =
    new URLSearchParams(
        window.location.search
    );

const token =
    urlParams.get("token");


/* ==========================================
   CHECK TOKEN
========================================== */

if (!token) {

    alert(
        "⚠️ Invalid or missing password reset link."
    );

}


/* ==========================================
   RESET PASSWORD
========================================== */

form.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        const passwordValue =
            password.value.trim();

        const confirmPasswordValue =
            confirmPassword.value.trim();


        /* ---------- VALIDATION ---------- */

        if (
            passwordValue === "" ||
            confirmPasswordValue === ""
        ) {

            alert(
                "⚠️ Please fill in both password fields."
            );

            return;

        }


        if (passwordValue.length < 6) {

            alert(
                "⚠️ Password must be at least 6 characters."
            );

            return;

        }


        if (
            passwordValue !==
            confirmPasswordValue
        ) {

            alert(
                "⚠️ Passwords do not match."
            );

            return;

        }


        if (!token) {

            alert(
                "⚠️ Invalid password reset link."
            );

            return;

        }


        /* ---------- BACKEND ---------- */

        try {

            const response =
                await fetch(
                    "http://localhost:5000/api/auth/reset-password",
                    {

                        method: "POST",

                        headers: {

                            "Content-Type":
                                "application/json"

                        },

                        body: JSON.stringify({

                            token: token,

                            password:
                                passwordValue

                        })

                    }
                );


            const data =
                await response.json();


            if (data.success) {

                alert(
                    "🎉 Password reset successfully! Please log in with your new password."
                );

                window.location.href =
                    "login.html";

            }

            else {

                alert(
                    "⚠️ " + data.message
                );

            }


        }

        catch (error) {

            console.error(
                "Reset Password Error:",
                error
            );

            alert(
                "⚠️ Unable to connect to the server."
            );

        }

    }
);