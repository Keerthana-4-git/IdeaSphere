// ==========================================
// Welcome Page Navigation
// ==========================================

document.addEventListener("DOMContentLoaded", function () {

    const getStartedBtn = document.getElementById("getStartedBtn");

    getStartedBtn.addEventListener("click", function () {

        window.location.href = "signup.html";

    });

});

/* ==========================================
        LOGOUT
========================================== */

const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {

    logoutBtn.addEventListener("click", function () {

        const confirmLogout = confirm(
            "Are you sure you want to logout?"
        );

        if (!confirmLogout) {

            return;

        }

        // Clear only session data
        localStorage.removeItem("selectedIdeaId");
        localStorage.removeItem("editIdeaIndex");

        // Redirect to login page
        window.location.href = "login.html";

        // If you don't have login.html yet,
        // replace it with "index.html"
    });

}