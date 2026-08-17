
/* ==========================================================
   IdeaSphere Collaboration Hub
   collaborate.js
   Part 1
========================================================== */

/* ==========================================================
                    DOM ELEMENTS
========================================================== */

const workspaceGrid = document.getElementById("workspaceGrid");
const emptyState = document.getElementById("emptyState");

const workspaceSearch = document.getElementById("workspaceSearch");

const workspaceCount = document.getElementById("workspaceCount");
const memberCount = document.getElementById("memberCount");
const completedCount = document.getElementById("completedCount");

const workspaceModal = document.getElementById("workspaceModal");

const workspaceForm = document.getElementById("workspaceForm");

const workspaceName = document.getElementById("workspaceName");
const workspaceDescription = document.getElementById("workspaceDescription");
const workspaceCategory = document.getElementById("workspaceCategory");
const workspaceStatus = document.getElementById("workspaceStatus");
const workspaceMembers = document.getElementById("workspaceMembers");

const modalTitle = document.getElementById("modalTitle");

/* ==========================================================
                    STORAGE
========================================================== */

const STORAGE_KEY = "ideasphere_workspaces";

/* ==========================================================
                    STATE
========================================================== */

let workspaces = [];

let editingWorkspaceId = null;

/* ==========================================================
                    LOCAL STORAGE
========================================================== */

async function loadWorkspaces() {

    try {

        const response = await getWorkspaces();

        if (!response.success) {

            console.error(
                "Load Workspaces Error:",
                response.message
            );

            workspaces = [];

            return;

        }

        workspaces = response.workspaces || [];

    }

    catch (error) {

        console.error(
            "Load Workspaces Error:",
            error
        );

        workspaces = [];

    }

}

/* ==========================================================
                    UTILITIES
========================================================== */

function generateId() {

    return Date.now().toString() +

        Math.random().toString(36).substring(2, 8);

}

function formatDate(date) {

    return new Date(date).toLocaleDateString(

        "en-IN",

        {

            day: "numeric",

            month: "short",

            year: "numeric"

        }

    );

}

/* ==========================================================
                WORKSPACE CARD
========================================================== */

function createWorkspaceCard(workspace) {

    const card = document.createElement("div");

    card.className = "workspace-card";

    card.dataset.id = workspace._id;

    card.innerHTML = `

        <div class="workspace-top">

            <div class="workspace-icon-circle">

                <i class="fa-solid fa-folder"></i>

            </div>

            <span class="workspace-category">

                ${workspace.category}

            </span>

        </div>

        <h3>${workspace.name}</h3>

        <p>

            ${workspace.description || "No description added."}

        </p>

        <div class="workspace-meta">

            <span>

                👥 ${workspace.members?.length || 0}

            </span>

            <span>

                ${workspace.status || "Active"}

            </span>

        </div>

        <div class="workspace-meta">

            <span>

                Created

            </span>

            <span>

                ${formatDate(workspace.createdAt)}

            </span>

        </div>

        <div class="workspace-actions">

            <button

                class="open-btn"

                data-action="open"

                data-id="${workspace._id}"

            >

                <i class="fa-solid fa-arrow-up-right-from-square"></i>

                Open

            </button>

            <button

                class="edit-btn"

                data-action="edit"

                data-id="${workspace._id}"

            >

                <i class="fa-solid fa-pen"></i>

                Edit

            </button>

            <button

                class="delete-btn"

                data-action="delete"

                data-id="${workspace._id}"

            >

                <i class="fa-solid fa-trash"></i>

                Delete

            </button>

        </div>

    `;

    return card;

}

/* ==========================================================
                EMPTY STATE
========================================================== */

function updateEmptyState() {

    if (workspaces.length === 0) {

        emptyState.style.display = "block";

        return;

    }

    emptyState.style.display = "none";

}

/* ==========================================================
                STATISTICS
========================================================== */

function updateStatistics() {

    workspaceCount.textContent = workspaces.length;

    let members = 0;

    let completed = 0;

    workspaces.forEach(workspace => {

        members += Number(workspace.members);

        if (workspace.status === "completed") {

            completed++;

        }

    });

    memberCount.textContent = members;

    completedCount.textContent = completed;

}

/* ==========================================================
                RENDER WORKSPACES
========================================================== */

function renderWorkspaces(list = workspaces) {

    workspaceGrid.innerHTML = "";

    if (list.length === 0) {

        workspaceGrid.appendChild(emptyState);

        updateEmptyState();

        updateStatistics();

        return;

    }

    list.forEach(workspace => {

        workspaceGrid.appendChild(

            createWorkspaceCard(workspace)

        );

    });

    updateEmptyState();

    updateStatistics();

}


/* ==========================================================
                    CREATE WORKSPACE
========================================================== */

async function handleCreateWorkspace() {

    const data = {

        name: workspaceName.value.trim(),

        description:
            workspaceDescription.value.trim(),

        category:
            workspaceCategory.value

    };


    try {

        const response =
            await createWorkspace(data);

        if (!response.success) {

            showToast(
                response.message ||
                "Unable to create workspace.",
                "error"
            );

            return;

        }

        workspaces.unshift(
            response.workspace
        );

        renderWorkspaces();

        showToast(
            "Workspace created successfully!",
            "success"
        );

    }

    catch (error) {

        console.error(
            "Create Workspace Error:",
            error
        );

        showToast(
            "Unable to create workspace.",
            "error"
        );

    }

}

/* ==========================================================
                    UPDATE WORKSPACE
========================================================== */

async function handleUpdateWorkspace() {

    const workspace =
        workspaces.find(
            workspace =>
                workspace._id === editingWorkspaceId
        );

    if (!workspace) return;


    const data = {

        name:
            workspaceName.value.trim(),

        description:
            workspaceDescription.value.trim(),

        category:
            workspaceCategory.value

    };


    try {

        const response =
            await updateWorkspace(
                editingWorkspaceId,
                data
            );

        if (!response.success) {

            showToast(
                response.message ||
                "Unable to update workspace.",
                "error"
            );

            return;

        }

        const index =
            workspaces.findIndex(
                workspace =>
                    workspace._id ===
                    editingWorkspaceId
            );

        if (index !== -1) {

            workspaces[index] =
                response.workspace;

        }

        renderWorkspaces();

        showToast(
            "Workspace updated successfully!",
            "success"
        );

    }

    catch (error) {

        console.error(
            "Update Workspace Error:",
            error
        );

        showToast(
            "Unable to update workspace.",
            "error"
        );

    }

}

/* ==========================================================
                    DELETE WORKSPACE
========================================================== */

async function handleDeleteWorkspace(id) {

    const confirmed =
        confirm(
            "Delete this workspace permanently?"
        );

    if (!confirmed) return;


    try {

        const response =
            await deleteWorkspace(id);

        if (!response.success) {

            showToast(
                response.message ||
                "Unable to delete workspace.",
                "error"
            );

            return;

        }

        workspaces =
            workspaces.filter(
                workspace =>
                    workspace._id !== id
            );

        renderWorkspaces();

        showToast(
            "Workspace deleted.",
            "success"
        );

    }

    catch (error) {

        console.error(
            "Delete Workspace Error:",
            error
        );

        showToast(
            "Unable to delete workspace.",
            "error"
        );

    }

}

/* ==========================================================
                    EDIT WORKSPACE
========================================================== */

function editWorkspace(id){

    const workspace = workspaces.find(

        workspace => workspace._id === id

    );

    if(!workspace) return;

    editingWorkspaceId = id;

    modalTitle.textContent = "Edit Workspace";

    workspaceName.value = workspace.name;

    workspaceDescription.value = workspace.description;

    workspaceCategory.value = workspace.category;

    workspaceStatus.value = workspace.status;

    workspaceMembers.value = workspace.members;

    workspaceModal.classList.add("active");

}

/* ==========================================================
                    SEARCH
========================================================== */

function searchWorkspace(){

    const keyword = workspaceSearch.value

        .trim()

        .toLowerCase();

    const filtered = workspaces.filter(workspace=>{

        return (

            workspace.name

                .toLowerCase()

                .includes(keyword)

            ||

            workspace.description

                .toLowerCase()

                .includes(keyword)

            ||

            workspace.category

                .toLowerCase()

                .includes(keyword)

        );

    });

    renderWorkspaces(filtered);

}

/* ==========================================================
                OPEN WORKSPACE
========================================================== */

function openWorkspace(id){

    localStorage.setItem(
        "currentWorkspace",
        id
    );

    showToast(
        "Opening workspace...",
        "success"
    );

    setTimeout(() => {

        window.location.href = "workspace.html";

    }, 500);

}

/* ==========================================================
                CARD BUTTON EVENTS
========================================================== */

workspaceGrid.addEventListener("click",(event)=>{

    const button = event.target.closest("button");

    if(!button) return;

    const action = button.dataset.action;

    const id = button.dataset.id;

    switch(action){

       case "edit":
    editWorkspace(id);
    break;

case "delete":
    handleDeleteWorkspace(id);
    break;  

        case "open":

            openWorkspace(id);

            break;

    }

});

/* ==========================================================
                SEARCH EVENT
========================================================== */

workspaceSearch.addEventListener(

    "input",

    searchWorkspace

);

/* ==========================================================
                FORM SUBMIT
========================================================== */

workspaceForm.addEventListener(

    "submit",

    function(event){

        event.preventDefault();

        if(editingWorkspaceId){

            updateWorkspace();

        }

        else{

            handleCreateWorkspace();

        }

        workspaceForm.reset();

        workspaceMembers.value = 1;

        editingWorkspaceId = null;

        modalTitle.textContent = "Create Workspace";

        workspaceModal.classList.remove("active");

    }

);
/* ==========================================================
                    MODAL CONTROLS
========================================================== */

const openButtons = [

    document.getElementById("openWorkspaceModal"),

    document.getElementById("heroCreateBtn"),

    document.getElementById("createWorkspaceBtn"),

    document.getElementById("emptyCreateBtn")

];

const closeModalBtn = document.getElementById("closeModal");

const cancelModalBtn = document.getElementById("cancelModal");

/* ==========================================================
                    RESET FORM
========================================================== */

function resetWorkspaceForm() {

    workspaceForm.reset();

    workspaceMembers.value = 1;

    workspaceStatus.value = "active";

    workspaceCategory.selectedIndex = 0;

    editingWorkspaceId = null;

    modalTitle.textContent = "Create Workspace";

}

/* ==========================================================
                    OPEN MODAL
========================================================== */

function openModal() {

    resetWorkspaceForm();

    workspaceModal.classList.add("active");

    workspaceName.focus();

}

/* ==========================================================
                    CLOSE MODAL
========================================================== */

function closeModal() {

    workspaceModal.classList.remove("active");

    resetWorkspaceForm();

}

/* ==========================================================
                    BUTTON EVENTS
========================================================== */

openButtons.forEach(button => {

    if(button){

        button.addEventListener("click", openModal);

    }

});

closeModalBtn.addEventListener(

    "click",

    closeModal

);

cancelModalBtn.addEventListener(

    "click",

    closeModal

);

/* ==========================================================
                CLICK OUTSIDE MODAL
========================================================== */

workspaceModal.addEventListener(

    "click",

    function(event){

        if(event.target === workspaceModal){

            closeModal();

        }

    }

);

/* ==========================================================
                    ESC KEY
========================================================== */

document.addEventListener(

    "keydown",

    function(event){

        if(event.key === "Escape"){

            closeModal();

        }

    }

);

/* ==========================================================
                    VALIDATION
========================================================== */

function validateWorkspace() {

    if(workspaceName.value.trim() === ""){

        showToast(

            "Workspace name is required.",

            "error"

        );

        workspaceName.focus();

        return false;

    }

    if(Number(workspaceMembers.value) < 1){

        showToast(

            "Members should be at least 1.",

            "error"

        );

        workspaceMembers.focus();

        return false;

    }

    return true;

}

/* ==========================================================
                OVERRIDE SUBMIT
========================================================== */

workspaceForm.addEventListener(

    "submit",

    function(event){

        event.preventDefault();

        if(!validateWorkspace()){

            return;

        }

    },

    true

);

/* ==========================================================
                    TOAST
========================================================== */

const toastContainer = document.getElementById(

    "toastContainer"

);

function showToast(message,type="success"){

    const toast = document.createElement("div");

    toast.className = `toast ${type}`;

    toast.innerHTML = `

        <strong>

            ${type==="success"?"Success":"Error"}

        </strong>

        <div style="margin-top:6px">

            ${message}

        </div>

    `;

    toastContainer.appendChild(toast);

    setTimeout(()=>{

        toast.style.opacity="0";

        toast.style.transform="translateX(80px)";

        setTimeout(()=>{

            toast.remove();

        },300);

    },2800);

}

/* ==========================================================
                    INITIALIZATION
========================================================== */

async function initializeCollaborationHub() {

    await loadWorkspaces();

    renderWorkspaces();

    updateStatistics();

}
/* ==========================================================
                    START APP
========================================================== */

initializeCollaborationHub();

console.log(

    "%cIdeaSphere Collaboration Hub Loaded 🚀",

    "color:#7A0F14;font-size:14px;font-weight:bold;"

);

/* ======================================================
        Invite Members Panel - Part 3A
====================================================== */

/* =============================================
        DOM ELEMENTS
============================================= */

const inviteOverlay = document.getElementById("inviteOverlay");

const closeInvitePanel = document.getElementById("closeInvitePanel");

const inviteForm = document.getElementById("inviteForm");

const inviteEmail = document.getElementById("inviteEmail");

const inviteRole = document.getElementById("inviteRole");

const inviteMessage = document.getElementById("inviteMessage");

const inviteWorkspaceName = document.getElementById("inviteWorkspaceName");

const inviteLink = document.getElementById("inviteLink");

const copyInviteLink = document.getElementById("copyInviteLink");

const pendingInviteList = document.getElementById("pendingInviteList");

/* =============================================
            STORAGE
============================================= */

const INVITE_STORAGE = "ideasphere_workspace_invites";

/* =============================================
            STATE
============================================= */

let invitations = [];

let currentWorkspace = null;




/* =============================================
        INVITE LINK
============================================= */

function generateInviteCode(){

    return Math.random()

        .toString(36)

        .substring(2,10)

        .toUpperCase();

}

function generateInviteLink(){

    const code = generateInviteCode();

    inviteLink.value =

        `https://ideasphere.app/invite/${code}`;

}

/* =============================================
        OPEN PANEL
============================================= */

function openInvitePanel(workspace){

    currentWorkspace = workspace;

    inviteWorkspaceName.textContent =

        workspace.name;

    generateInviteLink();

    loadWorkspaceInvitations(
    workspace._id || workspace.id
);

    inviteOverlay.classList.add("active");

}

/* =============================================
        CLOSE PANEL
============================================= */

function closeInviteMembers(){

    inviteOverlay.classList.remove("active");

    inviteForm.reset();

}

/* =============================================
        BUTTON EVENTS
============================================= */

closeInvitePanel.addEventListener(

    "click",

    closeInviteMembers

);

inviteOverlay.addEventListener(

    "click",

    function(e){

        if(e.target===inviteOverlay){

            closeInviteMembers();

        }

    }

);

/* =============================================
        ESC KEY
============================================= */

document.addEventListener(

    "keydown",

    function(e){

        if(e.key==="Escape"){

            closeInviteMembers();

        }

    }

);

/* =============================================
        COPY LINK
============================================= */

copyInviteLink.addEventListener(

    "click",

    async function(){

        try{

            await navigator.clipboard.writeText(

                inviteLink.value

            );

            showToast(

                "Invite link copied!",

                "success"

            );

        }

        catch{

            showToast(

                "Unable to copy link.",

                "error"

            );

        }

    }

);

/* =============================================
        RENDER INVITATIONS
============================================= */

function renderInvitations(){

    if(!currentWorkspace) return;

    const workspaceInvites = invitations.filter(

        invite =>

        invite.workspaceId === currentWorkspace.id

    );

    pendingInviteList.innerHTML="";

    if(workspaceInvites.length===0){

        pendingInviteList.innerHTML=`

            <div class="empty-invite">

                <i class="fa-solid fa-user-plus"></i>

                <h4>No Invitations Yet</h4>

                <p>

                    Invite teammates to start collaborating.

                </p>

            </div>

        `;

        return;

    }

}

async function loadWorkspaceInvitations(
    workspaceId
) {

    try {

        const result =
            await getWorkspaceInvitations(
                workspaceId
            );


        if (!result.success) {

            console.error(
                "Load Invitations Error:",
                result.message
            );

            invitations = [];

            renderInvitations();

            return;

        }


        invitations =
            result.invitations || [];


        renderInvitations();

    }

    catch (error) {

        console.error(
            "Load Invitations Error:",
            error
        );

        invitations = [];

        renderInvitations();

    }

}

/* ======================================================
        Invite Members Panel - Part 3B
====================================================== */

/* =============================================
        EMAIL VALIDATION
============================================= */

function isValidEmail(email){

    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return pattern.test(email);

}

/* =============================================
        SEND INVITATION
============================================= */

inviteForm.addEventListener(

    "submit",

    async function(event){

        event.preventDefault();

        const email =
            inviteEmail.value.trim().toLowerCase();

        const role =
            inviteRole.value;

        const message =
            inviteMessage.value.trim();


        if(!currentWorkspace){

            showToast(
                "No workspace selected.",
                "error"
            );

            return;

        }


        if(email === ""){

            showToast(
                "Please enter an email address.",
                "error"
            );

            inviteEmail.focus();

            return;

        }


        if(!isValidEmail(email)){

            showToast(
                "Please enter a valid email.",
                "error"
            );

            inviteEmail.focus();

            return;

        }


        const workspaceId =
            currentWorkspace._id ||
            currentWorkspace.id;


        const alreadyInvited =
            invitations.find(invite =>

                (
                    invite.workspace?._id ||
                    invite.workspace ||
                    invite.workspaceId
                ) === workspaceId &&

                invite.email === email &&

                (
                    invite.status === "Pending" ||
                    invite.status === undefined
                )

            );


        if(alreadyInvited){

            showToast(
                "This email has already been invited.",
                "error"
            );

            return;

        }


        const result =
            await createInvitation({

                workspaceId,

                email,

                role,

                message

            });


        if(!result.success){

            showToast(

                result.message ||
                "Unable to send invitation.",

                "error"

            );

            return;

        }


        invitations.unshift(
            result.invitation
        );


        renderInvitations();


        inviteForm.reset();

        inviteRole.value =
            "Editor";


        showToast(

            "Invitation sent successfully!",

            "success"

        );

    }

);

/* =============================================
        RENDER INVITATION CARDS
============================================= */

function renderInvitations(){

    if(!currentWorkspace) return;

    const workspaceInvites = invitations.filter(

        invite=>invite.workspaceId===currentWorkspace.id

    );

    pendingInviteList.innerHTML="";

    if(workspaceInvites.length===0){

        pendingInviteList.innerHTML=`

            <div class="empty-invite">

                <i class="fa-solid fa-user-plus"></i>

                <h4>No Invitations Yet</h4>

                <p>

                    Invite teammates to start collaborating.

                </p>

            </div>

        `;

        return;

    }

    workspaceInvites.forEach(invite=>{

        const card=document.createElement("div");

        card.className="invited-card";

        card.dataset.id=invite.id;

        card.innerHTML=`

            <div class="invited-user">

                <strong>

                    ${invite.email}

                </strong>

                <span>

                    ${invite.role}

                </span>

                <span>

                    ${invite.status}

                </span>

                <span>

                    ${invite.invitedAt}

                </span>

            </div>

            <div class="invite-actions">

                <button

                    class="resend-btn"

                    data-action="resend"

                    data-id="${invite.id}"

                >

                    Resend

                </button>

                <button

                    class="cancel-btn"

                    data-action="cancel"

                    data-id="${invite.id}"

                >

                    Cancel

                </button>

            </div>

        `;

        pendingInviteList.appendChild(card);

    });

}
/* ======================================================
        Invite Members Panel - Part 3C
====================================================== */

/* =============================================
        INVITATION ACTIONS
============================================= */

pendingInviteList.addEventListener("click", function (event) {

    const button = event.target.closest("button");

    if (!button) return;

    const action = button.dataset.action;

    const inviteId = button.dataset.id;

    const invitation = invitations.find(

        invite => invite.id === inviteId

    );

    if (!invitation) return;

    /* ===========================
            CANCEL
    =========================== */

    if (action === "cancel") {

        const confirmDelete = confirm(

            `Cancel invitation for ${invitation.email}?`

        );

        if (!confirmDelete) return;

        invitations = invitations.filter(

            invite => invite.id !== inviteId

        );

        saveInvitations();

        renderInvitations();

        showToast(

            "Invitation cancelled successfully.",

            "success"

        );

    }

    /* ===========================
            RESEND
    =========================== */

    if (action === "resend") {

        invitation.invitedAt = new Date().toLocaleString();

        invitation.status = "Pending";

        saveInvitations();

        renderInvitations();

        showToast(

            `Invitation resent to ${invitation.email}`,

            "success"

        );

    }

});

/* =============================================
        RESET PANEL
============================================= */

function resetInvitePanel() {

    inviteForm.reset();

    inviteRole.value = "Editor";

}

/* =============================================
        IMPROVED CLOSE
============================================= */

function closeInviteMembers() {

    inviteOverlay.classList.remove("active");

    resetInvitePanel();

}

/* =============================================
        OPEN FROM FEATURE CARD
============================================= */

const inviteMembersCard = document.getElementById(

    "inviteMembersCard"

);

if (inviteMembersCard) {

    inviteMembersCard.addEventListener(

        "click",

        function () {

            if (workspaces.length === 0) {

                showToast(

                    "Create a workspace first.",

                    "error"

                );

                return;

            }

            openInvitePanel(workspaces[0]);

        }

    );

}

/* =============================================
        PAGE LOAD
============================================= */

document.addEventListener(

    "DOMContentLoaded",

    function () {

        loadInvitations();

        generateInviteLink();

    }

);

/* =============================================
        DEBUG
============================================= */

console.log(

    "%cInvite Members Module Loaded 🚀",

    "color:#7A0F14;font-weight:bold;font-size:14px;"

);
/* ==========================================
        WORKSPACE DISCUSSION
========================================== */

const workspaceDiscussionCard =
    document.getElementById("workspaceDiscussionCard");

if(workspaceDiscussionCard){

    workspaceDiscussionCard.addEventListener("click",()=>{

        const workspaces = JSON.parse(

            localStorage.getItem("ideasphere_workspaces")

        ) || [];

        if(workspaces.length===0){

            alert("Create a workspace first.");

            return;

        }

        const currentWorkspace =

            localStorage.getItem("currentWorkspace")

            ||

            workspaces[0].id;

        localStorage.setItem(

            "currentWorkspace",

            currentWorkspace

        );

        localStorage.setItem(

            "workspaceActiveTab",

            "discussion"

        );

        window.location.href="workspace.html";

    });

}

/* ======================================================
                CLOUD SYNC
====================================================== */

/* ===========================
        DOM ELEMENTS
=========================== */

/* ==========================================
        CLOUD SYNC CARD
========================================== */

const cloudSyncCard =
document.getElementById("cloudSyncCard");

if(cloudSyncCard){

    cloudSyncCard.onclick = function(){

        openCloudSync();

    };

}

const cloudOverlay =
document.getElementById("cloudOverlay");

const closeCloudSync =
document.getElementById("closeCloudSync");

const syncNowBtn =
document.getElementById("syncNowBtn");

const syncProgressBar =
document.getElementById("syncProgressBar");

const syncPercentage =
document.getElementById("syncPercentage");

const lastSyncTime =
document.getElementById("lastSyncTime");

const cloudStatus =
document.getElementById("cloudStatus");

/* ===========================
        STORAGE
=========================== */

const CLOUD_SYNC_KEY =

"ideasphere_last_cloud_sync";

/* ===========================
        LOAD LAST SYNC
=========================== */

function loadLastSync(){

    const lastSync = localStorage.getItem(

        CLOUD_SYNC_KEY

    );

    if(lastSync){

        lastSyncTime.textContent = lastSync;

    }

    else{

        lastSyncTime.textContent = "Never";

    }

}

/* ===========================
        OPEN MODAL
=========================== */

function openCloudSync(){

    loadLastSync();

    syncProgressBar.style.width = "0%";

    syncPercentage.textContent = "0%";

    syncProgressBar.style.background = "#7A0F14";

    cloudStatus.innerHTML = "Ready to Sync";

    syncNowBtn.innerHTML = `
        <i class="fa-solid fa-cloud-arrow-up"></i>
        Sync Now
    `;

    syncNowBtn.disabled = false;

    cloudOverlay.classList.add("active");

}

/* ===========================
        CLOSE MODAL
=========================== */

function closeCloudSyncModal(){

    cloudOverlay.classList.remove("active");

}

/* ===========================
        EVENTS
=========================== */

cloudSyncCard.addEventListener(

    "click",

    openCloudSync

);

closeCloudSync.addEventListener(

    "click",

    closeCloudSyncModal

);

cloudOverlay.addEventListener(

    "click",

    function(event){

        if(event.target===cloudOverlay){

            closeCloudSyncModal();

        }

    }

);

/* ===========================
        SYNC
=========================== */

syncNowBtn.addEventListener(

    "click",

    function(){

        syncNowBtn.disabled = true;

syncNowBtn.innerHTML = `
    <i class="fa-solid fa-spinner fa-spin"></i>
    Syncing...
`;

cloudStatus.innerHTML = "Syncing...";

let progress = 0;

syncProgressBar.style.width = "0%";

syncPercentage.textContent = "0%";

const interval = setInterval(function(){

    progress += 2;

    syncProgressBar.style.width = progress + "%";

    syncPercentage.textContent = progress + "%";

    if(progress >= 100){

        clearInterval(interval);

        syncProgressBar.style.background = "#22C55E";

        const now = new Date().toLocaleString();

        localStorage.setItem(

            CLOUD_SYNC_KEY,

            now

        );

        lastSyncTime.textContent = now;

        cloudStatus.innerHTML = `
            <span style="color:#22C55E;">
                <i class="fa-solid fa-circle-check"></i>
                Sync Complete
            </span>
        `;

        syncNowBtn.innerHTML = `
            <i class="fa-solid fa-check"></i>
            Synced
        `;

        showToast(

            "Cloud Sync completed successfully!",

            "success"

        );

    }

},25);
});

/* ===========================
        ESC KEY
=========================== */

document.addEventListener(

    "keydown",

    function(event){

        if(

            event.key==="Escape" &&

            cloudOverlay.classList.contains(

                "active"

            )

        ){

            closeCloudSyncModal();

        }

    }

);

/* ===========================
        INITIALIZE
=========================== */

loadLastSync();

