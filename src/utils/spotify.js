const SPOTIFY_BASE_URL = 'https://api.spotify.com/v1';

const getAuthHeaders = () => {
    const token = localStorage.getItem('access_token');
    return {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
    };
};

export const searchTracks = async (query) => {
    try {
        const response = await fetch(
            `${SPOTIFY_BASE_URL}/search?type=track&q=${encodeURIComponent(query)}`,
            {
                headers: getAuthHeaders(),
            }
        );

        if (!response.ok) {
            throw new Error('Failed to search tracks');
        }

        const data = await response.json();
        
        // Transform the Spotify track data into our app's format
        return data.tracks.items.map(track => ({
            id: track.id,
            name: track.name,
            artist: track.artists[0].name,
            album: track.album.name,
            uri: track.uri
        }));
    } catch (error) {
        console.error('Error searching tracks:', error);
        throw error;
    }
};

const getCurrentUserId = async () => {
    try {
        const response = await fetch(`${SPOTIFY_BASE_URL}/me`, {
            headers: getAuthHeaders(),
        });

        if (!response.ok) {
            throw new Error('Failed to get user profile');
        }

        const data = await response.json();
        return data.id;
    } catch (error) {
        console.error('Error getting user ID:', error);
        throw error;
    }
};

const createPlaylist = async (userId, name) => {
    try {
        const response = await fetch(
            `${SPOTIFY_BASE_URL}/users/${userId}/playlists`,
            {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify({
                    name: name,
                    description: 'Created with Jammming',
                    public: false
                })
            }
        );

        if (!response.ok) {
            throw new Error('Failed to create playlist');
        }

        const data = await response.json();
        return data.id;
    } catch (error) {
        console.error('Error creating playlist:', error);
        throw error;
    }
};

const addTracksToPlaylist = async (playlistId, trackUris) => {
    try {
        const response = await fetch(
            `${SPOTIFY_BASE_URL}/playlists/${playlistId}/tracks`,
            {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify({
                    uris: trackUris
                })
            }
        );

        if (!response.ok) {
            throw new Error('Failed to add tracks to playlist');
        }

        return await response.json();
    } catch (error) {
        console.error('Error adding tracks to playlist:', error);
        throw error;
    }
};

export const savePlaylist = async (name, tracks) => {
    try {
        if (!name || !tracks.length) {
            throw new Error('Please provide a playlist name and at least one track');
        }

        // Get the current user's ID
        const userId = await getCurrentUserId();

        // Create a new playlist
        const playlistId = await createPlaylist(userId, name);

        // Add tracks to the playlist
        const trackUris = tracks.map(track => track.uri);
        await addTracksToPlaylist(playlistId, trackUris);

        return playlistId;
    } catch (error) {
        console.error('Error saving playlist:', error);
        throw error;
    }
}; 