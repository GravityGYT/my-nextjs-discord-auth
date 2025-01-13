
import { parse } from "cookie";

export default function handler(req, res) {
    const cookies = parse(req.headers.cookie || "");
    const session = cookies.session ? JSON.parse(cookies.session) : null;

    if (session) {
        res.status(200).json(session);
    } else {
        res.status(401).json({ error: "Not authenticated" });
    }
}
