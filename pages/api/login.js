const CLIENT_ID = process.env.DISCORD_CLIENT_ID;
const REDIRECT_URI = `${process.env.NEXT_PUBLIC_BASE_URL}/api/callback`;

export default function handler(req, res) {
    const discordAuthUrl = `https://discord.com/api/oauth2/authorize?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(
        REDIRECT_URI
    )}&response_type=code&scope=identify`;

    // Serve a script that performs a redirect and sends the token back via postMessage
    res.send(`
        <html>
        <head>
            <title>Login with Discord</title>
            <script>
                // Open the Discord authentication window
                window.location.href = '${discordAuthUrl}';

                // After the user authenticates, capture the token and send it to the parent window
                window.addEventListener('load', function () {
                    const params = new URLSearchParams(window.location.search);
                    const token = params.get('token'); // Assuming token is returned in query

                    if (token && window.opener) {
                        window.opener.postMessage({
                            type: 'discord-auth',
                            token: token
                        }, '*');
                        window.close(); // Close the login window
                    }
                });
            </script>
        </head>
        <body>
            <p>Redirecting to Discord for authentication...</p>
        </body>
        </html>
    `);
}
