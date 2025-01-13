
// ==UserScript==
// @name         Snay.io Public Skins Drawer with Discord Login
// @namespace    http://tampermonkey.net/
// @version      6.5
// @description  Adds Discord login functionality and dynamic profile updates.
// @author       You
// @match        https://www.snay.io/*
// @grant        GM_xmlhttpRequest
// @connect      your-vercel-app.vercel.app
// ==/UserScript==

(function () {
    "use strict";

    const API_BASE_URL = "https://your-vercel-app.vercel.app/api";

    function getUserData() {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: `${API_BASE_URL}/user`,
                headers: { "Content-Type": "application/json" },
                onload: (response) => {
                    if (response.status === 200) {
                        resolve(JSON.parse(response.responseText));
                    } else {
                        reject("User not authenticated");
                    }
                },
                onerror: () => reject("Failed to fetch user data"),
            });
        });
    }

    async function initializeProfileMenu() {
        const profileImage = document.querySelector(".profile-image");
        const loginItem = document.querySelector("#loginItem");

        try {
            const userData = await getUserData();
            profileImage.src = `https://cdn.discordapp.com/avatars/${userData.id}/${userData.avatar}.png`;
            loginItem.textContent = "Logout";
            loginItem.href = `${API_BASE_URL}/logout`;
            loginItem.onclick = (e) => {
                e.preventDefault();
                GM_xmlhttpRequest({
                    method: "POST",
                    url: `${API_BASE_URL}/logout`,
                    onload: () => {
                        profileImage.src = "https://i.imgur.com/V4RclNb.png";
                        loginItem.textContent = "Login";
                        loginItem.href = `${API_BASE_URL}/login`;
                    },
                });
            };
        } catch {
            profileImage.src = "https://i.imgur.com/V4RclNb.png";
            loginItem.textContent = "Login";
            loginItem.href = `${API_BASE_URL}/login`;
        }
    }

    initializeProfileMenu();
})();
