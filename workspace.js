/* ==========================================================
                    WORKSPACE.JS
========================================================== */

"use strict";

/* ==========================================================
                    STORAGE KEYS
========================================================== */

const STORAGE_KEY = "ideasphere_workspaces";
const CURRENT_KEY = "currentWorkspace";

/* ==========================================================
                    DOM ELEMENTS
========================================================== */

// Header

const workspaceTitle = document.getElementById("workspaceTitle");
const workspaceDescription = document.getElementById("workspaceDescription");
const workspaceCategory = document.getElementById("workspaceCategory");
const workspaceCategoryText = document.getElementById("workspaceCategoryText");

const memberCount = document.getElementById("memberCount");
const createdDate = document.getElementById("createdDate");
const workspaceCreated = document.getElementById("workspaceCreated");
const workspaceBreadcrumb = document.getElementById("workspaceBreadcrumb");

// Containers

const membersContainer = document.getElementById("membersContainer");
const activityPreview = document.getElementById("activityPreview");
const activityContainer = document.getElementById("activityContainer");

const todoTasks = document.getElementById("todoTasks");
const progressTasks = document.getElementById("progressTasks");
const completedTasks = document.getElementById("completedTasks");

const filesContainer = document.getElementById("filesContainer");
const notesContainer = document.getElementById("notesContainer");

// Progress

const progressFill = document.getElementById("progressFill");
const progressPercent = document.getElementById("progressPercent");

// Counters

const todoCount = document.getElementById("todoCount");
const progressCount = document.getElementById("progressCount");
const completedCount = document.getElementById("completedCount");

const discussionMessages =
    document.getElementById("discussionMessages");

const discussionInput =
    document.getElementById("discussionInput");

const sendDiscussionBtn =
    document.getElementById("sendDiscussionBtn");

/* ==========================================================
                        TABS
========================================================== */

const tabs = document.querySelectorAll(".tab-btn");
const tabContents = document.querySelectorAll(".tab-content");

/* ==========================================================
                        MODALS
========================================================== */

const inviteModal = document.getElementById("inviteModal");
const taskModal = document.getElementById("taskModal");
const noteModal = document.getElementById("noteModal");
const fileModal = document.getElementById("fileModal");

/* ==========================================================
                        BUTTONS
========================================================== */

const inviteMemberBtn = document.getElementById("inviteMemberBtn");
const saveMemberBtn = document.getElementById("saveMemberBtn");

const newTaskBtn = document.getElementById("newTaskBtn");
const createTaskBtn = document.getElementById("createTaskBtn");
const saveTaskBtn = document.getElementById("saveTaskBtn");

const addNoteBtn = document.getElementById("addNoteBtn");
const createNoteBtn = document.getElementById("createNoteBtn");
const saveNoteBtn = document.getElementById("saveNoteBtn");

const uploadFileBtn = document.getElementById("uploadFileBtn");
const uploadNewFileBtn = document.getElementById("uploadNewFileBtn");
const uploadBtn = document.getElementById("uploadBtn");

/* ==========================================================
                        INPUTS
========================================================== */

const memberName = document.getElementById("memberName");

const taskTitle = document.getElementById("taskTitle");
const taskDescription = document.getElementById("taskDescription");
const taskStatus = document.getElementById("taskStatus");

const noteTitle = document.getElementById("noteTitle");
const noteContent = document.getElementById("noteContent");

const workspaceFile = document.getElementById("workspaceFile");

/* ==========================================================
                    APPLICATION DATA
========================================================== */

let workspace = null;

/* ==========================================================
                    HELPERS
========================================================== */



function getCurrentWorkspaceId() {

    return localStorage.getItem(CURRENT_KEY);

}

function saveCurrentWorkspace(id) {

    localStorage.setItem(CURRENT_KEY, id);

}

function generateId() {

    return Date.now().toString() +
        Math.random().toString(36).substring(2, 7);

}

function formatDate(date) {

    return new Date(date).toLocaleDateString("en-IN", {

        day: "numeric",
        month: "short",
        year: "numeric"

    });

}

/* ==========================================================
                CREATE DEFAULT WORKSPACE
========================================================== */

function createDefaultWorkspace() {

    return {

        id: generateId(),

        name: "New Workspace",

        description: "Start collaborating with your team.",

        category: "General",

        createdAt: new Date().toISOString(),

        members: [],

        tasks: [],

        notes: [],

        files: [],

        activity: []

    };

}
/* ==========================================================
                LOAD CURRENT WORKSPACE
========================================================== */
async function loadWorkspace() {

    try {

        const response = await getWorkspaces();

        if (!response.success) {

            console.error(
                "Failed to load workspaces:",
                response.message
            );

            workspace = createDefaultWorkspace();

            return;

        }

        const workspaces = response.workspaces || [];

        /* ==========================================
                NO WORKSPACE EXISTS
        ========================================== */

        if (workspaces.length === 0) {

            const response = await createWorkspace({

                name: "New Workspace",

                description:
                    "Start collaborating with your team.",

                category: "General",

                members: [],

                tasks: [],

                notes: [],

                files: [],

                activity: [],

                discussions: []

            });

            if (!response.success) {

                console.error(
                    "Failed to create default workspace:",
                    response.message
                );

                workspace = createDefaultWorkspace();

                return;

            }

            workspace = response.workspace;

            localStorage.setItem(
                CURRENT_KEY,
                workspace._id
            );

            return;

        }

        /* ==========================================
                GET CURRENT WORKSPACE
        ========================================== */

        const currentId =
            localStorage.getItem(CURRENT_KEY);

        workspace =
            workspaces.find(
                ws => ws._id === currentId
            ) || workspaces[0];

        /* ==========================================
                SAVE CURRENT ID
        ========================================== */

        localStorage.setItem(
            CURRENT_KEY,
            workspace._id
        );

        /* ==========================================
                ENSURE ARRAYS EXIST
        ========================================== */

        workspace.members ??= [];
        workspace.tasks ??= [];
        workspace.notes ??= [];
        workspace.files ??= [];
        workspace.activity ??= [];
        workspace.discussions ??= [];

    }

    catch (error) {

        console.error(
            "Load Workspace Error:",
            error
        );

        workspace =
            createDefaultWorkspace();

    }

}


/* ==========================================================
                SAVE CURRENT WORKSPACE
========================================================== */

async function saveWorkspace() {

    if (!workspace || !workspace._id) {
        return;
    }

    try {

        const data = {
            name: workspace.name,
            description: workspace.description,
            category: workspace.category,
            members: workspace.members,
            tasks: workspace.tasks,
            notes: workspace.notes,
            files: workspace.files,
            activity: workspace.activity,
            discussions: workspace.discussions
        };

        const response = await updateWorkspace(
            workspace._id,
            data
        );

        if (!response.success) {

            console.error(
                "Workspace save failed:",
                response.message
            );

        }

    }

    catch (error) {

        console.error(
            "Workspace backend save error:",
            error
        );

    }

}


/* ==========================================================
                    UPDATE HEADER
========================================================== */

function renderWorkspaceHeader() {

    workspaceTitle.textContent =
        workspace.name || "Workspace";

    workspaceBreadcrumb.textContent =
        workspace.name || "Workspace";

    workspaceDescription.textContent =
        workspace.description || "";

    workspaceCategory.textContent =
        workspace.category || "General";

    workspaceCategoryText.textContent =
        workspace.category || "General";

    const created = formatDate(workspace.createdAt);

    createdDate.textContent = created;

    workspaceCreated.textContent = created;

    memberCount.textContent =
        workspace.members.length;

}


/* ==========================================================
                    TAB SWITCHING
========================================================== */

tabs.forEach(tab => {

    tab.addEventListener("click", () => {

        tabs.forEach(btn =>
            btn.classList.remove("active")
        );

        tabContents.forEach(section =>
            section.classList.remove("active-tab")
        );

        tab.classList.add("active");

        const target =
            document.getElementById(
                tab.dataset.tab
            );

        if (target) {

            target.classList.add("active-tab");

        }

    });

});


/* ==========================================================
                    MODAL HELPERS
========================================================== */

function openModal(modal) {

    modal.classList.add("active");

}

function closeModal(modal) {

    modal.classList.remove("active");

}


/* ==========================================================
                    MODAL BUTTONS
========================================================== */

inviteMemberBtn.addEventListener("click", () => {

    openModal(inviteModal);

});

newTaskBtn.addEventListener("click", () => {

    openModal(taskModal);

});

createTaskBtn.addEventListener("click", () => {

    openModal(taskModal);

});

addNoteBtn.addEventListener("click", () => {

    openModal(noteModal);

});

createNoteBtn.addEventListener("click", () => {

    openModal(noteModal);

});

uploadFileBtn.addEventListener("click", () => {

    openModal(fileModal);

});

uploadNewFileBtn.addEventListener("click", () => {

    openModal(fileModal);

});


/* ==========================================================
                CLOSE MODALS
========================================================== */

document.querySelectorAll(".close-modal")
.forEach(button => {

    button.addEventListener("click", () => {

        closeModal(button.closest(".modal"));

    });

});


window.addEventListener("click", e => {

    if (e.target.classList.contains("modal")) {

        closeModal(e.target);

    }

});

/* ==========================================================
                    MEMBERS
========================================================== */

function renderMembers() {

    membersContainer.innerHTML = "";

    if (workspace.members.length === 0) {

        membersContainer.innerHTML = `
            <div class="empty-box">
                No members yet.
            </div>
        `;

        memberCount.textContent = "0";
        return;
    }

    memberCount.textContent = workspace.members.length;

    workspace.members.forEach(member => {

        const card = document.createElement("div");

        card.className = "member-card";

        card.innerHTML = `

            <div class="member-avatar">

                ${member.name.charAt(0).toUpperCase()}

            </div>

            <div class="member-info">

                <h4>${member.name}</h4>

                <span>${member.role}</span>

            </div>

            <button class="remove-member"
                    data-id="${member.id}">

                <i class="fa-solid fa-trash"></i>

            </button>

        `;

        membersContainer.appendChild(card);

    });

    attachMemberEvents();

}


/* ==========================================================
                ADD MEMBER
========================================================== */

saveMemberBtn.addEventListener("click", () => {

    const name = memberName.value.trim();

    if (!name) {

        alert("Enter member name.");

        return;

    }

    workspace.members.push({

        id: generateId(),

        name: name,

        role: "Collaborator"

    });

    addActivity(

        `Added ${name} to the workspace.`

    );

    memberName.value = "";

    closeModal(inviteModal);

    saveWorkspace();

    renderMembers();

    renderActivity();

});


/* ==========================================================
                REMOVE MEMBER
========================================================== */

function attachMemberEvents() {

    document.querySelectorAll(".remove-member")

    .forEach(button => {

        button.onclick = () => {

            const id = button.dataset.id;

            const member = workspace.members.find(

                m => m.id === id

            );

            workspace.members = workspace.members.filter(

                m => m.id !== id

            );

            addActivity(

                `Removed ${member.name}.`

            );

            saveWorkspace();

            renderMembers();

            renderActivity();

        };

    });

}


/* ==========================================================
                ACTIVITY
========================================================== */

function addActivity(text) {

    workspace.activity.unshift({

        id: generateId(),

        text: text,

        date: new Date().toISOString()

    });

    if (workspace.activity.length > 25) {

        workspace.activity.pop();

    }

}


/* ==========================================================
                ACTIVITY PREVIEW
========================================================== */

function renderActivityPreview() {

    activityPreview.innerHTML = "";

    const recent = workspace.activity.slice(0,3);

    if (recent.length === 0) {

        activityPreview.innerHTML = `

            <div class="empty-box">

                No activity yet.

            </div>

        `;

        return;

    }

    recent.forEach(item => {

        activityPreview.innerHTML += `

            <div class="activity-item">

                <div class="activity-icon">

                    <i class="fa-solid fa-clock"></i>

                </div>

                <div class="activity-text">

                    <h4>${item.text}</h4>

                    <small>

                        ${formatDate(item.date)}

                    </small>

                </div>

            </div>

        `;

    });

}


/* ==========================================================
                ACTIVITY PAGE
========================================================== */

function renderActivity() {

    activityContainer.innerHTML = "";

    if (workspace.activity.length === 0) {

        activityContainer.innerHTML = `

            <div class="empty-box">

                No activity yet.

            </div>

        `;

        return;

    }

    workspace.activity.forEach(item => {

        activityContainer.innerHTML += `

            <div class="activity-card">

                <div class="activity-avatar">

                    <i class="fa-solid fa-bolt"></i>

                </div>

                <div class="activity-content">

                    <h4>${item.text}</h4>

                    <small>

                        ${formatDate(item.date)}

                    </small>

                </div>

            </div>

        `;

    });

}



/* ==========================================================
                    TASKS
========================================================== */

function renderTasks() {

    todoTasks.innerHTML = "";
    progressTasks.innerHTML = "";
    completedTasks.innerHTML = "";

    let todo = 0;
    let progress = 0;
    let completed = 0;

    if (workspace.tasks.length === 0) {

        todoTasks.innerHTML = `
            <div class="empty-box">
                No pending tasks.
            </div>
        `;

        progressTasks.innerHTML = `
            <div class="empty-box">
                Nothing in progress.
            </div>
        `;

        completedTasks.innerHTML = `
            <div class="empty-box">
                No completed tasks.
            </div>
        `;

        updateProgress();

        return;
    }

    workspace.tasks.forEach(task => {

        const card = createTaskCard(task);

        switch (task.status) {

            case "todo":

                todoTasks.appendChild(card);
                todo++;
                break;

            case "progress":

                progressTasks.appendChild(card);
                progress++;
                break;

            case "completed":

                completedTasks.appendChild(card);
                completed++;
                break;

        }

    });

    todoCount.textContent = todo;
    progressCount.textContent = progress;
    completedCount.textContent = completed;

    updateProgress();

}


/* ==========================================================
                CREATE TASK CARD
========================================================== */

function createTaskCard(task) {

    const card = document.createElement("div");

    card.className = "task-card";

    card.dataset.id = task.id;

    card.innerHTML = `

        <h4>${task.title}</h4>

        <p>${task.description}</p>

        <div class="task-footer">

            <span class="status-badge ${task.status}">

                ${getStatusText(task.status)}

            </span>

            <div class="task-actions">

                <button class="edit-task"
                        data-id="${task.id}">

                    <i class="fa-solid fa-pen"></i>

                </button>

                <button class="delete-task"
                        data-id="${task.id}">

                    <i class="fa-solid fa-trash"></i>

                </button>

            </div>

        </div>

    `;

    return card;

}


/* ==========================================================
                STATUS LABEL
========================================================== */

function getStatusText(status) {

    switch(status){

        case "todo":
            return "To Do";

        case "progress":
            return "In Progress";

        case "completed":
            return "Completed";

        default:
            return status;

    }

}


/* ==========================================================
                ADD TASK
========================================================== */



/* ==========================================================
                PROGRESS
========================================================== */

function updateProgress(){

    const total = workspace.tasks.length;

    if(total === 0){

        progressFill.style.width = "0%";
        progressPercent.textContent = "0%";

        return;

    }

    const completed = workspace.tasks.filter(

        task => task.status === "completed"

    ).length;

    const percent = Math.round(

        (completed / total) * 100

    );

    progressFill.style.width = percent + "%";

    progressPercent.textContent = percent + "%";

}



/* ==========================================================
                    EDIT TASK
========================================================== */

let editingTaskId = null;

document.addEventListener("click", (e) => {

    const editBtn = e.target.closest(".edit-task");

    if (!editBtn) return;

    const id = editBtn.dataset.id;

    const task = workspace.tasks.find(t => t.id === id);

    if (!task) return;

    editingTaskId = id;

    taskTitle.value = task.title;
    taskDescription.value = task.description;
    taskStatus.value = task.status;

    openModal(taskModal);

});


/* ==========================================================
                UPDATE / CREATE TASK
========================================================== */

saveTaskBtn.onclick = () => {

    const title = taskTitle.value.trim();

    if (!title) {

        alert("Enter task title.");

        return;

    }

    if (editingTaskId) {

        const task = workspace.tasks.find(

            t => t.id === editingTaskId

        );

        task.title = title;
        task.description = taskDescription.value.trim();
        task.status = taskStatus.value;

        addActivity(`Updated task "${title}".`);

        editingTaskId = null;

    } else {

        workspace.tasks.push({

            id: generateId(),

            title,

            description: taskDescription.value.trim(),

            status: taskStatus.value,

            createdAt: new Date().toISOString()

        });

        addActivity(`Created task "${title}".`);

    }

    taskTitle.value = "";
    taskDescription.value = "";
    taskStatus.value = "todo";

    closeModal(taskModal);

    saveWorkspace();

    renderTasks();
    renderActivityPreview();
    renderActivity();

};


/* ==========================================================
                DELETE TASK
========================================================== */

document.addEventListener("click", (e) => {

    const deleteBtn = e.target.closest(".delete-task");

    if (!deleteBtn) return;

    const id = deleteBtn.dataset.id;

    const task = workspace.tasks.find(

        t => t.id === id

    );

    if (!confirm(`Delete "${task.title}"?`)) return;

    workspace.tasks = workspace.tasks.filter(

        t => t.id !== id

    );

    addActivity(`Deleted task "${task.title}".`);

    saveWorkspace();

    renderTasks();
    renderActivityPreview();
    renderActivity();

});


/* ==========================================================
                CHANGE STATUS
========================================================== */

document.addEventListener("dblclick", (e) => {

    const card = e.target.closest(".task-card");

    if (!card) return;

    const task = workspace.tasks.find(

        t => t.id === card.dataset.id

    );

    if (!task) return;

    if (task.status === "todo") {

        task.status = "progress";

    }

    else if (task.status === "progress") {

        task.status = "completed";

    }

    else {

        task.status = "todo";

    }

    addActivity(

        `Changed "${task.title}" to ${getStatusText(task.status)}.`

    );

    saveWorkspace();

    renderTasks();
    renderActivityPreview();
    renderActivity();

});



/* ==========================================================
                    NOTES
========================================================== */

let editingNoteId = null;

function renderNotes() {

    notesContainer.innerHTML = "";

    if (workspace.notes.length === 0) {

        notesContainer.innerHTML = `
            <div class="empty-box">
                <i class="fa-regular fa-note-sticky"></i>
                <h3>No Notes Yet</h3>
                <p>Create your first workspace note.</p>
            </div>
        `;

        return;
    }

    workspace.notes.forEach(note => {

        notesContainer.innerHTML += `

            <div class="note-card">

                <h3>${note.title}</h3>

                <p>${note.content}</p>

                <div class="note-footer">

                    <span class="note-date">

                        ${formatDate(note.createdAt)}

                    </span>

                    <div class="note-actions">

                        <button class="edit-note"
                                data-id="${note.id}">

                            <i class="fa-solid fa-pen"></i>

                        </button>

                        <button class="delete-note"
                                data-id="${note.id}">

                            <i class="fa-solid fa-trash"></i>

                        </button>

                    </div>

                </div>

            </div>

        `;

    });

}


/* ==========================================================
                SAVE NOTE
========================================================== */

saveNoteBtn.onclick = () => {

    const title = noteTitle.value.trim();

    if (!title) {

        alert("Enter note title.");

        return;

    }

    if (editingNoteId) {

        const note = workspace.notes.find(

            n => n.id === editingNoteId

        );

        note.title = title;
        note.content = noteContent.value;

        addActivity(`Updated note "${title}".`);

        editingNoteId = null;

    }

    else {

        workspace.notes.push({

            id: generateId(),

            title,

            content: noteContent.value,

            createdAt: new Date().toISOString()

        });

        addActivity(`Created note "${title}".`);

    }

    noteTitle.value = "";
    noteContent.value = "";

    closeModal(noteModal);

    saveWorkspace();

    renderNotes();

    renderActivityPreview();

    renderActivity();

};


/* ==========================================================
                EDIT NOTE
========================================================== */

document.addEventListener("click", e => {

    const btn = e.target.closest(".edit-note");

    if (!btn) return;

    const note = workspace.notes.find(

        n => n.id === btn.dataset.id

    );

    editingNoteId = note.id;

    noteTitle.value = note.title;

    noteContent.value = note.content;

    openModal(noteModal);

});


/* ==========================================================
                DELETE NOTE
========================================================== */

document.addEventListener("click", e => {

    const btn = e.target.closest(".delete-note");

    if (!btn) return;

    const note = workspace.notes.find(

        n => n.id === btn.dataset.id

    );

    if (!confirm("Delete this note?")) return;

    workspace.notes = workspace.notes.filter(

        n => n.id !== btn.dataset.id

    );

    addActivity(`Deleted note "${note.title}".`);

    saveWorkspace();

    renderNotes();

    renderActivityPreview();

    renderActivity();

});


/* ==========================================================
                    FILES
========================================================== */

function renderFiles() {

    filesContainer.innerHTML = "";

    if (workspace.files.length === 0) {

        filesContainer.innerHTML = `

            <div class="empty-box">

                <i class="fa-regular fa-folder-open"></i>

                <h3>No Files Uploaded</h3>

                <p>Upload your first file.</p>

            </div>

        `;

        return;

    }

    workspace.files.forEach(file => {

        filesContainer.innerHTML += `

            <div class="file-card">

                <div class="file-icon">

                    <i class="fa-solid fa-file"></i>

                </div>

                <h4>${file.name}</h4>

                <p>

                    ${formatDate(file.createdAt)}

                </p>

                <div class="file-actions">

                    <button class="download-file"

                            data-id="${file.id}">

                        <i class="fa-solid fa-download"></i>

                    </button>

                    <button class="delete-file"

                            data-id="${file.id}">

                        <i class="fa-solid fa-trash"></i>

                    </button>

                </div>

            </div>

        `;

    });

}


/* ==========================================================
                UPLOAD FILE
========================================================== */

uploadBtn.onclick = () => {

    if (!workspaceFile.files.length) {

        alert("Choose a file.");

        return;

    }

    const file = workspaceFile.files[0];

    workspace.files.push({

        id: generateId(),

        name: file.name,

        size: file.size,

        createdAt: new Date().toISOString()

    });

    addActivity(

        `Uploaded "${file.name}".`

    );

    workspaceFile.value = "";

    closeModal(fileModal);

    saveWorkspace();

    renderFiles();

    renderActivityPreview();

    renderActivity();

};


/* ==========================================================
                DELETE FILE
========================================================== */

document.addEventListener("click", e => {

    const btn = e.target.closest(".delete-file");

    if (!btn) return;

    const file = workspace.files.find(

        f => f.id === btn.dataset.id

    );

    if (!confirm(`Delete "${file.name}"?`)) return;

    workspace.files = workspace.files.filter(

        f => f.id !== btn.dataset.id

    );

    addActivity(

        `Deleted "${file.name}".`

    );

    saveWorkspace();

    renderFiles();

    renderActivityPreview();

    renderActivity();

});


/* ==========================================================
                DOWNLOAD FILE
========================================================== */

document.addEventListener("click", e => {

    const btn = e.target.closest(".download-file");

    if (!btn) return;

    alert(

        "File download will be connected to backend/cloud storage later."

    );

});

/* ==========================================================
                DISCUSSION
========================================================== */

function renderDiscussions(){

    discussionMessages.innerHTML = "";

    if(workspace.discussions.length === 0){

        discussionMessages.innerHTML = `

            <div class="empty-chat">

                <i class="fa-regular fa-comments"></i>

                <h3>No discussions yet</h3>

                <p>Start the first conversation.</p>

            </div>

        `;

        return;

    }

    workspace.discussions.forEach(message=>{

        discussionMessages.innerHTML += `

            <div class="message">

                <div class="message-header">

                    <span class="message-user">

                        ${message.user}

                    </span>

                    <span class="message-time">

                        ${formatDate(message.time)}

                    </span>

                </div>

                <div class="message-text">

                    ${message.text}

                </div>

            </div>

        `;

    });

    discussionMessages.scrollTop =
        discussionMessages.scrollHeight;

}

sendDiscussionBtn.onclick = () => {

    const text = discussionInput.value.trim();

    if(!text){

        return;

    }

    workspace.discussions.push({

        id:generateId(),

        user:"You",

        text:text,

        time:new Date().toISOString()

    });

    addActivity("Posted a discussion message.");

    discussionInput.value = "";

    saveWorkspace();

    renderDiscussions();

    renderActivityPreview();

    renderActivity();

};

/* ==========================================================
                UPDATE RENDER
========================================================== */

function renderWorkspace() {

    renderWorkspaceHeader();

    renderMembers();

    renderTasks();

    renderNotes();

    renderFiles();

    renderActivityPreview();

    renderActivity();

    renderDiscussions();

}
/* ==========================================================
                    TAB PERSISTENCE
========================================================== */

tabs.forEach(tab => {

    tab.addEventListener("click", () => {

        localStorage.setItem(
            "workspaceActiveTab",
            tab.dataset.tab
        );

    });

});

function restoreActiveTab() {

    const activeTab = localStorage.getItem(
        "workspaceActiveTab"
    );

    if (!activeTab) return;

    tabs.forEach(tab =>
        tab.classList.remove("active")
    );

    tabContents.forEach(content =>
        content.classList.remove("active-tab")
    );

    const tab = document.querySelector(

        `.tab-btn[data-tab="${activeTab}"]`

    );

    const section = document.getElementById(activeTab);

    if (tab && section) {

        tab.classList.add("active");

        section.classList.add("active-tab");

    }

}


/* ==========================================================
                    EMPTY STATES
========================================================== */

function checkEmptyStates() {

    if (!workspace.tasks.length) {

        updateProgress();

    }

}


/* ==========================================================
                DRAG & DROP TASKS
========================================================== */

document.addEventListener("dragstart", e => {

    const card = e.target.closest(".task-card");

    if (!card) return;

    e.dataTransfer.setData(

        "taskId",

        card.dataset.id

    );

});

document.querySelectorAll(".task-list")

.forEach(list => {

    list.addEventListener("dragover", e => {

        e.preventDefault();

        list.classList.add("drag-over");

    });

    list.addEventListener("dragleave", () => {

        list.classList.remove("drag-over");

    });

    list.addEventListener("drop", e => {

        e.preventDefault();

        list.classList.remove("drag-over");

        const id = e.dataTransfer.getData("taskId");

        const task = workspace.tasks.find(

            t => t.id === id

        );

        if (!task) return;

        if (list.id === "todoTasks") {

            task.status = "todo";

        }

        else if (list.id === "progressTasks") {

            task.status = "progress";

        }

        else {

            task.status = "completed";

        }

        addActivity(

            `Moved "${task.title}" to ${getStatusText(task.status)}.`

        );

        saveWorkspace();

        renderTasks();

        renderActivityPreview();

        renderActivity();

    });

});




/* ==========================================================
                FINAL REFRESH
========================================================== */

function refreshWorkspace() {

    renderWorkspaceHeader();

    renderMembers();

    renderTasks();

    renderNotes();

    renderFiles();

    renderActivityPreview();

    renderActivity();

    updateProgress();

    checkEmptyStates();

    renderDiscussions();

}


/* ==========================================================
                INITIALIZE APP
========================================================== */

document.addEventListener(
    "DOMContentLoaded",
    async () => {

        await loadWorkspace();

        refreshWorkspace();

        restoreActiveTab();

    }
);




