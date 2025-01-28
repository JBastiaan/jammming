// Generate a random string for the state parameter
const generateRandomString = (length) => {
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const values = crypto.getRandomValues(new Uint8Array(length));
    return values.reduce((acc, x) => acc + possible[x % possible.length], "");
};

// Generate a code verifier
const generateCodeVerifier = () => {
    return generateRandomString(64);
};

// Generate a code challenge from the code verifier
const generateCodeChallenge = async (codeVerifier) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(codeVerifier);
    const digest = await crypto.subtle.digest('SHA-256', data);
    
    return btoa(String.fromCharCode(...new Uint8Array(digest)))
        .replace(/=/g, '')
        .replace(/\+/g, '-')
        .replace(/\//g, '_');
};

const SPOTIFY_CLIENT_ID = import.meta.env.SPOTIFY_CLIENT_ID;
const REDIRECT_URI = import.meta.env.REDIRECT_URI;

const clearStoredAuthData = () => {
    localStorage.removeItem('code_verifier');
    localStorage.removeItem('spotify_auth_state');
};

export const initiateSpotifyLogin = async () => {
    try {
        // Check if we're already in the process of authenticating
        if (localStorage.getItem('auth_in_progress')) {
            console.log('Auth already in progress, skipping...');
            return;
        }

        // Clear any existing auth data
        clearStoredAuthData();
        
        // Generate and store PKCE values
        const codeVerifier = generateCodeVerifier();
        const codeChallenge = await generateCodeChallenge(codeVerifier);
        
        // Generate state
        const state = generateRandomString(16);
        
        // Store values in localStorage
        localStorage.setItem('code_verifier', codeVerifier);
        localStorage.setItem('spotify_auth_state', state);
        localStorage.setItem('auth_in_progress', 'true');
        
        // Verify storage was successful
        const storedState = localStorage.getItem('spotify_auth_state');
        const storedVerifier = localStorage.getItem('code_verifier');
        
        if (!storedState || !storedVerifier) {
            throw new Error('Failed to store authentication data');
        }

        // Required scopes for the application
        const scope = 'playlist-modify-public playlist-modify-private';
        
        // Build the authorization URL
        const args = new URLSearchParams({
            response_type: 'code',
            client_id: SPOTIFY_CLIENT_ID,
            scope: scope,
            redirect_uri: REDIRECT_URI,
            state: state,
            code_challenge_method: 'S256',
            code_challenge: codeChallenge
        });

        // Redirect to Spotify authorization page
        window.location.href = 'https://accounts.spotify.com/authorize?' + args;
    } catch (error) {
        localStorage.removeItem('auth_in_progress');
        clearStoredAuthData();
        throw error;
    }
};

export const getAccessToken = async (code) => {
    try {
        const codeVerifier = localStorage.getItem('code_verifier');
        
        if (!codeVerifier) {
            throw new Error('No code verifier found in storage');
        }
        
        const response = await fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                grant_type: 'authorization_code',
                code: code,
                redirect_uri: REDIRECT_URI,
                client_id: SPOTIFY_CLIENT_ID,
                code_verifier: codeVerifier,
            }),
        });

        const data = await response.json();
        if (response.ok) {
            // Store the tokens
            localStorage.setItem('access_token', data.access_token);
            localStorage.setItem('refresh_token', data.refresh_token);
            clearStoredAuthData(); // Clean up auth data after successful token exchange
            localStorage.removeItem('auth_in_progress');
            return data.access_token;
        } else {
            throw new Error(data.error_description || 'Failed to get access token');
        }
    } catch (error) {
        console.error('Error getting access token:', error);
        clearStoredAuthData();
        localStorage.removeItem('auth_in_progress');
        throw error;
    }
};

export const handleCallback = async () => {
    try {
        // Check if we've already handled this callback
        if (localStorage.getItem('access_token')) {
            console.log('Already authenticated, skipping callback handling');
            return localStorage.getItem('access_token');
        }

        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        const state = urlParams.get('state');
        const storedState = localStorage.getItem('spotify_auth_state');
        const error = urlParams.get('error');

        if (error) {
            throw new Error('Authorization error: ' + error);
        }

        if (!state || !storedState) {
            throw new Error('Missing state parameter');
        }

        if (state !== storedState) {
            throw new Error(`State mismatch. Received: ${state}, Stored: ${storedState}`);
        }

        if (code) {
            return await getAccessToken(code);
        }
    } catch (error) {
        clearStoredAuthData();
        localStorage.removeItem('auth_in_progress');
        throw error;
    }
};

export const isAuthenticated = () => {
    return !!localStorage.getItem('access_token');
}; 