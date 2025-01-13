export default function handler(req, res) {
    // Optional if you use session-based auth
    res.status(200).send({ message: 'Logged out successfully' });
}
