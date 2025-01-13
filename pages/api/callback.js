
import fetch from "node-fetch";
import { serialize } from "cookie";

const CLIENT_ID = process.env.DISCORD_CLIENT_ID;
const CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET;
const REDIRECT_URI = `${process.env.NEXT_PUBLIC_BASE_URL}/api/callback`;

export default async function handler(req, res) {
    const { code } = req.query;

    try {
        // Exchange code for access token
        const tokenResponse = await fetch("https://discord.com/api/oauth2/token", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({
                client_id: CLIENT_ID,
                client_secret: CLIENT_SECRET,
                grant_type: "authorization_code",
                code,
                redirect_uri: REDIRECT_URI,
            }),
        });
        const tokenData = await tokenResponse.json();

        // Fetch user details from Discord API
        const userResponse = await fetch("https://discord.com/api/users/@me", {
            headers: { Authorization: `Bearer ${tokenData.access_token}` },
        });
        const userData = await userResponse.json();

        // Save user data in a cookie
        res.setHeader(
            "Set-Cookie",
            serialize("session", JSON.stringify(userData), {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                path: "/",
            })
        );

        res.redirect("/"); // Redirect back to the homepage or another route
    } catch (error) {
        console.error("Error in OAuth2 callback:", error);
        res.status(500).json({ error: "Authentication failed" });
    }
}
