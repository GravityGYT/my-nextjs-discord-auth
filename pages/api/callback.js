import fetch from 'node-fetch';

export default async function handler(req, res) {
    const { code } = req.query;

    const tokenResponse = await fetch('https://discord.com/api/oauth2/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            client_id: process.env.DISCORD_CLIENT_ID,
            client_secret: process.env.DISCORD_CLIENT_SECRET,
            grant_type: 'authorization_code',
            code,
            redirect_uri: `${process.env.BASE_URL}/api/callback`,
        }),
    });
    const tokenData = await tokenResponse.json();

    const userResponse = await fetch('https://discord.com/api/users/@me`, {
        headers: {
            Authorization: `Bearer ${tokenData.access_token}`,
        },
    });
    const userData = await userResponse.json();

    // Send user data back to the frontend
    res.json(userData);
}
