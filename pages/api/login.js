export default function handler(req, res) {
    const CLIENT_ID = process.env.DISCORD_CLIENT_ID;
    const REDIRECT_URI = `${process.env.NEXT_PUBLIC_BASE_URL}/api/callback`;
    const SCOPE = 'identify';
    const DISCORD_LOGIN_URL = `https://discord.com/api/oauth2/authorize?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=code&scope=${SCOPE}`;
    res.redirect(DISCORD_LOGIN_URL);
}
