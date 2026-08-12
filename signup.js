/* ==========================================
        GET ELEMENTS
========================================== */

const signupForm = document.getElementById("signupForm");

const password = document.getElementById("password");
const confirmPassword = document.getElementById("confirmPassword");

const togglePassword = document.getElementById("togglePassword");
const toggleConfirmPassword = document.getElementById("toggleConfirmPassword");

const googleBtn = document.querySelector(".google-btn");


/* ==========================================
      SHOW / HIDE PASSWORD
========================================== */

togglePassword.addEventListener("click", function () {

    if (password.type === "password") {

        password.type = "text";

        togglePassword.classList.remove("fa-eye");
        togglePassword.classList.add("fa-eye-slash");

    }

    else {

        password.type = "password";

        togglePassword.classList.remove("fa-eye-slash");
        togglePassword.classList.add("fa-eye");

    }

});


/* ==========================================
   SHOW / HIDE CONFIRM PASSWORD
========================================== */

toggleConfirmPassword.addEventListener("click", function () {

    if (confirmPassword.type === "password") {

        confirmPassword.type = "text";

        toggleConfirmPassword.classList.remove("fa-eye");
        toggleConfirmPassword.classList.add("fa-eye-slash");

    }

    else {

        confirmPassword.type = "password";

        toggleConfirmPassword.classList.remove("fa-eye-slash");
        toggleConfirmPassword.classList.add("fa-eye");

    }

});


/* ==========================================
      SIGN UP VALIDATION
========================================== */

signupForm.addEventListener("submit", async function (event) {

    event.preventDefault();

    const fullName = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const passwordValue = password.value.trim();
    const confirmValue = confirmPassword.value.trim();


    if (

        fullName === "" ||
        email === "" ||
        passwordValue === "" ||
        confirmValue === ""

    ) {

        alert("⚠️ Please fill in all the fields.");

        return;

    }


    if (!email.includes("@") || !email.includes(".")) {

        alert("⚠️ Please enter a valid email address.");

        return;

    }


    if (passwordValue.length < 8) {

        alert("⚠️ Password should contain at least 8 characters.");

        return;

    }


    if (passwordValue !== confirmValue) {

        alert("⚠️ Passwords do not match.");

        return;

    }
    
try {

    const data = await registerUser(
        fullName,
        email,
        passwordValue
    );

    if (data.success) {

        alert("🎉 Account Created Successfully!");

        window.location.href = "login.html";

    }

    else {

        alert("⚠️ " + data.message);

    }

}

catch (error) {

    console.error("Registration Error:", error);

    alert("⚠️ Unable to connect to the server.");

}

});


/* ==========================================
        GOOGLE SIGN UP
========================================== */

googleBtn.addEventListener("click", function () {

    alert("Welcome to IdeaSphere!");

    window.location.href = "home.html";

});