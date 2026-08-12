/* ==========================================
        SETTINGS PAGE
========================================== */

// Cloud Sync Key

const CLOUD_SYNC_KEY = "ideaSphereLastSync";

// Elements

const lastSyncDisplay = document.getElementById("lastSyncDisplay");

const notificationToggle = document.querySelector(
    ".switch input"
);

const editProfileBtn = document.querySelector(".edit-btn");

const cloudSyncBtn = document.getElementById("openCloudSync");


/* ==========================================
        LOAD LAST SYNC
========================================== */

function loadLastSync(){

    const lastSync = localStorage.getItem(
        CLOUD_SYNC_KEY
    );

    if(lastSync){

        lastSyncDisplay.textContent = lastSync;

    }else{

        lastSyncDisplay.textContent = "Never";

    }

}


/* ==========================================
        NOTIFICATION TOGGLE
========================================== */

const notificationState = localStorage.getItem(
    "ideaSphereNotifications"
);

if(notificationState !== null){

    notificationToggle.checked =
        notificationState === "true";

}

notificationToggle.addEventListener(
    "change",
    function(){

        localStorage.setItem(

            "ideaSphereNotifications",

            notificationToggle.checked

        );

    }
);



/* ==========================================
        CLOUD SYNC
========================================== */

cloudSyncBtn.addEventListener(

    "click",

    function(){

        window.location.href = "collaborate.html";

    }

);


/* ==========================================
        PAGE LOAD
========================================== */

loadLastSync();
/* ==========================================
        EDIT PROFILE
========================================== */

const editProfileModal =
document.getElementById("editProfileModal");

const closeProfileModal =
document.getElementById("closeProfileModal");

const saveProfileBtn =
document.getElementById("saveProfileBtn");

const profileNameInput =
document.getElementById("profileNameInput");

const profileUsernameInput =
document.getElementById("profileUsernameInput");

const profileBioInput =
document.getElementById("profileBioInput");


/* ==========================================
        PAGE ELEMENTS
========================================== */

const profileName =
document.getElementById("profileName");

const profileUsername =
document.getElementById("profileUsername");

const profileBio =
document.getElementById("profileBio");

const profileInitial =
document.getElementById("profileInitial");

const profileHeaderName =
document.getElementById("profileHeaderName");

const profileHeaderRole =
document.getElementById("profileHeaderRole");


/* ==========================================
        DEFAULT PROFILE
========================================== */

let profile = JSON.parse(

    localStorage.getItem("ideaSphereProfile")

) || {

    name:"Keerthana",

    username:"@keerthana",

    bio:"Building ideas into reality ✨",

    role:"Workspace Owner"

};


/* ==========================================
        LOAD PROFILE
========================================== */

function loadProfile(){

    profileName.textContent = profile.name;

    profileUsername.textContent = profile.username;

    profileBio.textContent = profile.bio;

    profileHeaderName.textContent = profile.name;

    profileHeaderRole.textContent = profile.role;

    profileInitial.textContent =
    profile.name.charAt(0).toUpperCase();

}


/* ==========================================
        OPEN MODAL
========================================== */

editProfileBtn.addEventListener("click",function(){

    profileNameInput.value = profile.name;

    profileUsernameInput.value = profile.username;

    profileBioInput.value = profile.bio;

    editProfileModal.classList.add("active");

});


/* ==========================================
        CLOSE MODAL
========================================== */

closeProfileModal.addEventListener("click",function(){

    editProfileModal.classList.remove("active");

});


editProfileModal.addEventListener("click",function(e){

    if(e.target===editProfileModal){

        editProfileModal.classList.remove("active");

    }

});


/* ==========================================
        SAVE PROFILE
========================================== */

saveProfileBtn.addEventListener("click",function(){

    profile.name = profileNameInput.value.trim();

    profile.username = profileUsernameInput.value.trim();

    profile.bio = profileBioInput.value.trim();

    if(profile.name===""){

        alert("Please enter your name.");

        return;

    }

    if(profile.username===""){

        profile.username="@user";

    }

    if(profile.bio===""){

        profile.bio="No bio added.";

    }

    localStorage.setItem(

        "ideaSphereProfile",

        JSON.stringify(profile)

    );

    loadProfile();

    editProfileModal.classList.remove("active");

});


/* ==========================================
        INITIAL LOAD
========================================== */

loadProfile();


