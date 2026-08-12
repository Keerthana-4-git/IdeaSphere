/* ==========================================
        IDEASPHERE SIDEBAR
========================================== */

// ===============================
// ACTIVE PAGE
// ===============================

const currentPage = document.body.dataset.page;

document.querySelectorAll(".sidebar li").forEach(item => {

    if(item.dataset.page === currentPage){

        item.classList.add("active");

    }

});


// ===============================
// LOGOUT
// ===============================

const logoutBtn = document.getElementById("logoutBtn");

if(logoutBtn){

    logoutBtn.addEventListener("click",()=>{

        const confirmLogout = confirm(
            "Are you sure you want to logout?"
        );

        if(!confirmLogout) return;

        localStorage.removeItem("selectedIdeaId");
        localStorage.removeItem("editIdeaIndex");

        window.location.href="login.html";

    });

}