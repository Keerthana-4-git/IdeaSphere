/* ==========================================
        GET ELEMENTS
========================================== */

const password = document.getElementById("password");
const togglePassword = document.getElementById("togglePassword");

const form = document.querySelector("form");

const googleBtn = document.querySelector(".google-btn");

const forgotPassword = document.querySelector(".forgot-password a");


/* ==========================================
        SHOW / HIDE PASSWORD
========================================== */

togglePassword.addEventListener("click", function () {

    if (password.type === "password") {

        password.type = "text";

        togglePassword.classList.remove("fa-eye");
        togglePassword.classList.add("fa-eye-slash");

    } else {

        password.type = "password";

        togglePassword.classList.remove("fa-eye-slash");
        togglePassword.classList.add("fa-eye");

    }

});


/* ==========================================
        LOGIN FORM
========================================== */

form.addEventListener("submit", async function (event) {

    event.preventDefault();

    const email = document
        .querySelector("input[type='email']")
        .value
        .trim();

    const passwordValue = password.value.trim();


    /* ---------- VALIDATION ---------- */

    if (email === "" || passwordValue === "") {

        alert("⚠️ Please fill in all the fields.");

        return;

    }


    if (!email.includes("@") || !email.includes(".")) {

        alert("⚠️ Please enter a valid email address.");

        return;

    }


    /* ---------- BACKEND LOGIN ---------- */

    try {

        const data = await loginUser(
            email,
            passwordValue
        );


        /* ---------- SUCCESS ---------- */

        if (data.success) {

            // Store JWT token
            localStorage.setItem(
                "ideasphereToken",
                data.token
            );

            // Store user information
            localStorage.setItem(
                "ideasphereUser",
                JSON.stringify(data.user)
            );

            alert("🎉 Login Successful!");

            window.location.href = "home.html";

        }


        /* ---------- LOGIN FAILED ---------- */

        else {

            alert("⚠️ " + data.message);

        }

    }

    catch (error) {

        console.error("Login Error:", error);

        alert("⚠️ Unable to connect to the server.");

    }

});


/* ==========================================
        GOOGLE SIGN IN
========================================== */

googleBtn.addEventListener("click", function () {

    alert("🎉 Welcome Back!");

    window.location.href = "home.html";

});


/* ==========================================
FORGOT PASSWORD
========================================== */

forgotPassword.addEventListener("click", function (event) {

    event.preventDefault();

    window.location.href = "forgot-password.html";

});

