/* ==========================================
   IDEASPHERE - FORGOT PASSWORD
========================================== */

const form =
    document.getElementById("forgotPasswordForm");

const emailInput =
    document.getElementById("email");


/* ==========================================
   FORGOT PASSWORD FORM
========================================== */

form.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        const email =
            emailInput.value.trim();


        /* ---------- VALIDATION ---------- */

        if (email === "") {

            alert(
                "⚠️ Please enter your email address."
            );

            return;

        }


        if (
            !email.includes("@") ||
            !email.includes(".")
        ) {

            alert(
                "⚠️ Please enter a valid email address."
            );

            return;

        }


        /* ---------- BACKEND ---------- */

        try {

            const response =
                await fetch(
                    "http://localhost:5000/api/auth/forgot-password",
                    {

                        method: "POST",

                        headers: {

                            "Content-Type":
                                "application/json"

                        },

                        body: JSON.stringify({

                            email: email

                        })

                    }
                );


            const data =
                await response.json();


            if (data.success) {

                alert(
                    "📧 If your account exists, a password reset link has been sent to your email."
                );

            } else {

                alert(
                    "⚠️ " + data.message
                );

            }


        } catch (error) {

            console.error(
                "Forgot Password Error:",
                error
            );

            alert(
                "⚠️ Unable to connect to the server."
            );

        }

    }
);