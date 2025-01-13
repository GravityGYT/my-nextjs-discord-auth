import fetch from "node-fetch";
import { serialize } from "cookie";

const CLIENT_ID = process.env.DISCORD_CLIENT_ID;
const CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET;
const REDIRECT_URI = `${process.env.NEXT_PUBLIC_BASE_URL}/api/callback`;

export default async function handler(req, res) {
    const { code } = req.query;

    if (!code) {
        return res.status(400).json({ error: "No code provided" });
    }

    try {
        // Exchange code for an access token
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

        if (!tokenData.access_token) {
            return res.status(400).json({ error: "Failed to exchange code for token" });
        }

        // Fetch user info from Discord
        const userResponse = await fetch("https://discord.com/api/users/@me", {
            headers: { Authorization: `Bearer ${tokenData.access_token}` },
        });

        const userData = await userResponse.json();

        // Set session cookie
        res.setHeader(
            "Set-Cookie",
            serialize("session", tokenData.access_token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                maxAge: 60 * 60 * 24, // 1 day
                path: "/",
            })
        );

        // Redirect to home page or desired route
        res.redirect("/");
    } catch (error) {
        console.error("Error during Discord OAuth callback:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}
