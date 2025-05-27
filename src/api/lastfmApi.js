const API_KEY = '8f4165162ee81d7004aadbb1da257ca3';
const BASE_URL = 'https://ws.audioscrobbler.com/2.0/';

function createAPIUrl(method, params) {
    const queryString = new URLSearchParams({
        method,
        api_key: API_KEY,
        format: 'json',
        ...params
    });

    return `${BASE_URL}?${queryString}`;
}

export async function fetchTopArtists(limit = 12) {
    const url = createAPIUrl('chart.gettopartists', { limit: limit });

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const data = await response.json();

        return Array.isArray(data.artists?.artist)
            ? data.artists.artist.slice(0, limit)
            : [data.artists?.artist].filter(Boolean);
    } catch (error) {
        console.error('Ошибка загрузки артистов:', error);
        return [];
    }
}

export async function fetchArtistsWithGenres(artists){
    const artistPromises = artists.map(async (art) => {
        try {
            const artistInfoUrl = createAPIUrl('artist.getInfo', { artist: art.name });
            const artistInfoResponse = await fetch(artistInfoUrl);
            
            if (!artistInfoResponse.ok) {
                throw new Error(`HTTP error! status: ${artistInfoResponse.status}`);
            }

            const artistInfo = await artistInfoResponse.json();
            return artistInfo.artist;
        } catch (error) {
            console.error(`Ошибка загрузки артиста: ${art.name}`, error);
            return null;
        }
    });

    const allArtists = await Promise.all(artistPromises);
    
    const successfulArtists = allArtists.filter(Boolean);
    
    return successfulArtists;
}

export async function fetchTopTracks(limit = 18) {
    const url = createAPIUrl('chart.gettoptracks', { limit: limit });

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const data = await response.json();

        console.log("fetchTopTracks", data)

        return Array.isArray(data.tracks?.track)
            ? data.tracks.track.slice(0, limit)
            : [data.tracks?.track].filter(Boolean);
    } catch (error) {
        console.error('Ошибка загрузки треков:', error);
        return [];
    }
}

export async function fetchTrackGenres(track) {
    try {
        const url = createAPIUrl('track.getInfo', {
            artist: track.artist.name,
            track: track.name
        });

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        console.log('Данные трека:', data);

        const tags = data?.track?.toptags?.tag;

        let genres = [];

        if (Array.isArray(tags)) {
            genres = tags
                .filter(tag => tag && tag.name)
                .map(tag => tag.name)
                .slice(0, 2);
        }

        return genres.length > 0 ? genres : ['No genre'];

    } catch (error) {
        console.error(`Ошибка получения жанров для ${track.name}:`, error);
        return ['No genre'];
    }
}

export async function fetchArtistGenres(artist) {
    try {
        const url = createAPIUrl('artist.getInfo', {
            artist: artist.name
        });

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        console.log('Данные артиста:', data);

        const tags = data?.artist?.tags?.tag;

        let genres = [];

        if (Array.isArray(tags)) {
            genres = tags
                .filter(tag => tag && tag.name)
                .map(tag => tag.name)
                .slice(0, 2);
        }

        return genres.length > 0 ? genres : ['No genre'];

    } catch (error) {
        console.error(`Ошибка получения жанров для ${artist.name}:`, error);
        return ['No genre'];
    }
}

export async function fetchAlbumGenres(album) {
    try {
        const url = createAPIUrl('album.getInfo', {
            album: album.name,
            artist: album.artist
        });

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        console.log('Данные альбома:', data);

        const tags = data?.album?.tags?.tag;

        let genres = [];

        if (Array.isArray(tags)) {
            genres = tags
                .filter(tag => tag && tag.name)
                .map(tag => tag.name)
                .slice(0, 2);
        }

        return genres.length > 0 ? genres : ['No genre'];

    } catch (error) {
        console.error(`Ошибка получения жанров для ${album.name}:`, error);
        return ['No genre'];
    }
}

export async function searchArtists(query) {
    const url = createAPIUrl('artist.search', { artist: query, limit: 12 });

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const data = await response.json();
        return Array.isArray(data.results?.artistmatches?.artist)
            ? data.results?.artistmatches?.artist
            : [data.results?.artistmatches?.artist].filter(Boolean);
    } catch (error) {
        console.error('Ошибка поиска артиста:', error);
        return [];
    }
}

export async function searchAlbums(query) {
    const url = createAPIUrl('album.search', { album: query, limit: 12 });

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const data = await response.json();
        return Array.isArray(data.results?.albummatches?.album)
            ? data.results?.albummatches?.album
            : [data.results?.albummatches?.album].filter(Boolean);
    } catch (error) {
        console.error('Ошибка поиска альбома:', error);
        return [];
    }
}

export async function searchTracks(query) {
    const url = createAPIUrl('track.search', { track: query, limit: 12 });

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const data = await response.json();
        return Array.isArray(data.results?.trackmatches?.track)
            ? data.results?.trackmatches?.track
            : [data.results?.trackmatches?.track].filter(Boolean);
    } catch (error) {
        console.error('Ошибка поиска трека:', error);
        return [];
    }
}