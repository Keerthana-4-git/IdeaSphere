/* ==========================================
        IDEASPHERE BACKEND URL
========================================== */

const API_URL = "http://localhost:5000/api";


/* ==========================================
        REGISTER USER
========================================== */

async function registerUser(fullName, email, password) {

    try {

        const response = await fetch(`${API_URL}/auth/register`, {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                fullName,
                email,
                password
            })

        });

        return await response.json();

    }

    catch (error) {

        console.error("Register Error:", error);

        return {
            success: false,
            message: "Unable to connect to the server."
        };

    }

}


/* ==========================================
        LOGIN USER
========================================== */

async function loginUser(email, password) {

    try {

        const response = await fetch(`${API_URL}/auth/login`, {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                email,
                password
            })

        });

        return await response.json();

    }

    catch (error) {

        console.error("Login Error:", error);

        return {
            success: false,
            message: "Unable to connect to the server."
        };

    }

}


/* ==========================================
        GET CURRENT USER
========================================== */

async function getCurrentUser() {

    const token = localStorage.getItem("ideasphereToken");

    if (!token) {

        return {
            success: false,
            message: "Not authenticated."
        };

    }

    try {

        const response = await fetch(`${API_URL}/auth/me`, {

            method: "GET",

            headers: {
                "Authorization": `Bearer ${token}`
            }

        });

        return await response.json();

    }

    catch (error) {

        console.error("Current User Error:", error);

        return {
            success: false,
            message: "Unable to connect to the server."
        };

    }

}