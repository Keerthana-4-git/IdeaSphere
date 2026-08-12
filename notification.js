/* ==========================================================
                    NOTIFICATION.JS
========================================================== */

"use strict";

/* ==========================================================
                    STORAGE
========================================================== */

const STORAGE_KEY = "ideasphere_notifications";

/* ==========================================================
                    DOM
========================================================== */

const notificationList =
document.getElementById("notificationList");

const emptyState =
document.getElementById("emptyState");

const totalNotifications =
document.getElementById("totalNotifications");

const unreadNotifications =
document.getElementById("unreadNotifications");

const readNotifications =
document.getElementById("readNotifications");

const markAllReadBtn =
document.getElementById("markAllReadBtn");

const filterButtons =
document.querySelectorAll(".filter-btn");

/* ==========================================================
                    DATA
========================================================== */

let notifications = [];

let currentFilter = "all";

/* ==========================================================
                    HELPERS
========================================================== */

function generateId(){

    return Date.now().toString() +
    Math.random().toString(36).substring(2,7);

}

function saveNotifications(){

    localStorage.setItem(

        STORAGE_KEY,

        JSON.stringify(notifications)

    );

}

function loadNotifications(){

    notifications = JSON.parse(

        localStorage.getItem(STORAGE_KEY)

    ) || [];

}

/* ==========================================================
                SAMPLE DATA
========================================================== */

function createSampleNotifications(){

    if(notifications.length) return;

    notifications = [

        {

            id:generateId(),

            title:"Workspace Created",

            message:"Travel App workspace created successfully.",

            icon:"fa-folder",

            time:"10 min ago",

            read:false

        },

        {

            id:generateId(),

            title:"New Task Added",

            message:"Homepage UI task was added.",

            icon:"fa-list-check",

            time:"30 min ago",

            read:false

        },

        {

            id:generateId(),

            title:"Discussion Started",

            message:"A new discussion has started in Travel App.",

            icon:"fa-comments",

            time:"1 hour ago",

            read:true

        },

        {

            id:generateId(),

            title:"File Uploaded",

            message:"PitchDeck.pdf uploaded successfully.",

            icon:"fa-file",

            time:"Yesterday",

            read:true

        }

    ];

    saveNotifications();

}

/* ==========================================================
                RENDER
========================================================== */

function renderNotifications(){

    notificationList.innerHTML="";

    let filtered = notifications;

    if(currentFilter==="unread"){

        filtered = notifications.filter(

            n=>!n.read

        );

    }

    if(currentFilter==="read"){

        filtered = notifications.filter(

            n=>n.read

        );

    }

    if(filtered.length===0){

        emptyState.style.display="block";

        notificationList.style.display="none";

    }

    else{

        emptyState.style.display="none";

        notificationList.style.display="flex";

    }

    filtered.forEach(notification=>{

        notificationList.innerHTML += `

        <div class="notification-card ${notification.read ? "" : "unread"}">

            <div class="notification-left">

                <div class="notification-icon">

                    <i class="fa-solid ${notification.icon}"></i>

                </div>

                <div class="notification-content">

                    <h3>

                        ${notification.title}

                    </h3>

                    <p>

                        ${notification.message}

                    </p>

                    <div class="notification-time">

                        ${notification.time}

                    </div>

                </div>

            </div>

            <div class="notification-actions">

                <button

                    class="mark-read"

                    data-id="${notification.id}"

                    title="Mark Read">

                    <i class="fa-solid fa-check"></i>

                </button>

                <button

                    class="delete"

                    data-id="${notification.id}"

                    title="Delete">

                    <i class="fa-solid fa-trash"></i>

                </button>

            </div>

        </div>

        `;

    });

    updateStats();

}

/* ==========================================================
                    STATS
========================================================== */

function updateStats(){

    totalNotifications.textContent =
    notifications.length;

    unreadNotifications.textContent =
    notifications.filter(

        n=>!n.read

    ).length;

    readNotifications.textContent =
    notifications.filter(

        n=>n.read

    ).length;

}

/* ==========================================================
                MARK READ
========================================================== */

document.addEventListener("click",e=>{

    const btn =
    e.target.closest(".mark-read");

    if(!btn) return;

    const notification =
    notifications.find(

        n=>n.id===btn.dataset.id

    );

    notification.read=true;

    saveNotifications();

    renderNotifications();

});

/* ==========================================================
                DELETE
========================================================== */

document.addEventListener("click",e=>{

    const btn =
    e.target.closest(".delete");

    if(!btn) return;

    notifications = notifications.filter(

        n=>n.id!==btn.dataset.id

    );

    saveNotifications();

    renderNotifications();

});

/* ==========================================================
                MARK ALL
========================================================== */

markAllReadBtn.onclick=()=>{

    notifications.forEach(

        n=>n.read=true

    );

    saveNotifications();

    renderNotifications();

};

/* ==========================================================
                FILTERS
========================================================== */

filterButtons.forEach(button=>{

    button.onclick=()=>{

        filterButtons.forEach(

            btn=>btn.classList.remove("active")

        );

        button.classList.add("active");

        currentFilter=

        button.dataset.filter;

        renderNotifications();

    };

});

/* ==========================================================
                INIT
========================================================== */

loadNotifications();

createSampleNotifications();

renderNotifications();

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