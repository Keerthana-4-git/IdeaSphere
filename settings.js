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
        PROFILE STATE
========================================== */

let profile = null;


/* ==========================================
        LOAD PROFILE
========================================== */

async function loadProfile() {

    try {

        const result =
            await getCurrentUser();


        if (!result.success) {

            console.error(
                "Load Profile Error:",
                result.message
            );

            return;

        }


        profile =
            result.user;


        profileName.textContent =
            profile.fullName || "User";

        profileUsername.textContent =
            profile.username || "";

        profileBio.textContent =
            profile.bio || "No bio added.";

        profileHeaderName.textContent =
            profile.fullName || "User";

        profileHeaderRole.textContent =
            profile.role || "Workspace Owner";

        profileInitial.textContent =
            (
                profile.fullName ||
                "U"
            )
            .charAt(0)
            .toUpperCase();

    }

    catch (error) {

        console.error(
            "Load Profile Error:",
            error
        );

    }

}


/* ==========================================
        OPEN MODAL
========================================== */

editProfileBtn.addEventListener(
    "click",
    function () {

        if (!profile) {

            console.warn(
                "Profile is still loading."
            );

            return;

        }


        profileNameInput.value =
            profile.fullName || "";

        profileUsernameInput.value =
            profile.username || "";

        profileBioInput.value =
            profile.bio || "";


        editProfileModal.classList.add(
            "active"
        );

    }
);


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

saveProfileBtn.addEventListener(
    "click",
    async function () {

        const fullName =
            profileNameInput.value.trim();

        const username =
            profileUsernameInput.value.trim();

        const bio =
            profileBioInput.value.trim();


        if (fullName === "") {

            alert(
                "Please enter your name."
            );

            return;

        }


        const updatedProfile = {

            fullName,

            username:
                username || "@user",

            bio:
                bio || "No bio added."

        };


        try {

            const result =
                await updateProfile(
                    updatedProfile
                );


            if (!result.success) {

                alert(
                    result.message ||
                    "Unable to update profile."
                );

                return;

            }


            profile =
                result.user;


            await loadProfile();


            editProfileModal.classList.remove(
                "active"
            );


        }

        catch (error) {

            console.error(
                "Save Profile Error:",
                error
            );

            alert(
                "Unable to update profile."
            );

        }

    }
);


/* ==========================================
        INITIAL LOAD
========================================== */

loadProfile();


