import { serialize } from "cookie";

export default function handler(req, res) {
    res.setHeader(
        "Set-Cookie",
        serialize("session", "", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: -1, // Expire immediately
            path: "/",
        })
    );

    res.json({ message: "Logged out successfully" });
}
