import fetch from "node-fetch";
import { parse } from "cookie";

export default async function handler(req, res) {
    const cookies = parse(req.headers.cookie || "");
    const token = cookies.session;

    if (!token) {
        return res.status(401).json({ error: "Not authenticated" });
    }

    try {
        // Fetch user info from Discord
        const userResponse = await fetch("https://discord.com/api/users/@me", {
            headers: { Authorization: `Bearer ${token}` },
        });

        if (!userResponse.ok) {
            throw new Error("Invalid session");
        }

        const userData = await userResponse.json();
        res.json(userData);
    } catch (error) {
        console.error("Error fetching user data:", error);
        res.status(401).json({ error: "Invalid session" });
    }
}
