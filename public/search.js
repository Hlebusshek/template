// search.js
const API_KEY = '8f4165162ee81d7004aadbb1da257ca3';
const BASE_URL = 'https://ws.audioscrobbler.com/2.0/';
const CALLBACK_URL = 'http://localhost:3000/callback/';

async function api_auth() {
    const url = `${CALLBACK_URL}?token=${API_KEY}`;
    try{
        const response = await fetch(url);
        if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
        }
    } catch (error) {
        console.error('Error api auth:', error);
        showError('Не удалось подключиться к Last.fm. Проверьте подключение.');
        return false;
    }
    return true;
}

document.addEventListener('DOMContentLoaded', async () => {
    const params = new URLSearchParams(window.location.search);
    const query = params.get('q') || 'never gonna give you up';
    
    document.getElementById('search-query').textContent = query;

    const auth = await api_auth();

    const artists = await searchArtists(query);
    const albums = await searchAlbums(query);
    const tracks = await searchTracks(query);

    renderTopResults(artists, albums, tracks);
    renderArtists(artists);
    renderAlbums(albums);
    renderTracks(tracks);

    const searchForm = document.querySelector('.search-form');
    if (searchForm) {
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const input = this.querySelector('input[name="q"]');
            const query = input.value.trim();
            
            if (query) {
                window.location.href = `search.html?q=${encodeURIComponent(query)}`;
            }
        });
    }
    setupTabs();
});

async function searchArtists(query) {
    const url = createAPIUrl('artist.search', { artist: query, limit: 12 });
    const response = await fetch(url);
    const data = await response.json();
    return data.results.artistmatches?.artist || [];
}

async function searchAlbums(query) {
    const url = createAPIUrl('album.search', { album: query, limit: 12 });
    const response = await fetch(url);
    const data = await response.json();
    return data.results.albummatches?.album || [];
}

async function searchTracks(query) {
    const url = createAPIUrl('track.search', { track: query, limit: 12 });
    const response = await fetch(url);
    const data = await response.json();
    return data.results.trackmatches?.track || [];
}

function createAPIUrl(method, params) {
    const queryString = new URLSearchParams({
        method,
        api_key: API_KEY,
        format: 'json',
        ...params
    });
    return `https://ws.audioscrobbler.com/2.0/?${queryString}`;
}

function renderArtists(artists) {
    const container = document.getElementById('artist-results');
    container.innerHTML = '';
    
    artists.forEach(artist => {
        const card = document.createElement('div');
        card.className = 'artist-card';
        card.innerHTML = `
          <img class="artist-image" src="${artist.image[2]['#text']}" alt="${artist.name}">
            <h3>${artist.name}</h3>
            <p>${artist.listeners} listeners</p>
        `;
        container.appendChild(card);
    });
}

function renderAlbums(albums) {
    const container = document.getElementById('album-results');
    container.innerHTML = '';
    
    albums.forEach(album => {
        const card = document.createElement('div');
        card.className = 'album-card';
        card.innerHTML = `
            <img class="album-image" src="${album.image[2]['#text']}" alt="${album.name}">
            <h3>${album.name}</h3>
            <p>${album.artist}</p>
        `;
        container.appendChild(card);
    });
}

function renderTracks(tracks) {
    const container = document.getElementById('track-results');
    container.innerHTML = '';
    
    tracks.forEach(track => {
        const card = document.createElement('div');
        card.className = 'track-card';
        card.innerHTML = `
            <img class="album-image" src="${track.image[2]['#text']}" alt="${track.name}">
            <h3>${track.name}</h3>
            <p>${track.artist}</p>
        `;
        container.appendChild(card);
    });
}

function renderTopResults(artists, albums, tracks) {
    const container = document.getElementById('top-results-grid');
    container.innerHTML = '';

    const topArtists = artists.slice(0, 14);
    const topAlbums = albums.slice(0, 14);
    const topTracks = tracks.slice(0, 14);

   const artistHeader = document.createElement('h3');
    artistHeader.textContent = 'Artists';
    artistHeader.classList.add('top-results-header');
    container.appendChild(artistHeader);

    topArtists.forEach(artist => {
        const card = document.createElement('div');
        card.className = 'top-result-card artist-card';
        card.innerHTML = `
            <img class="artist-image" src="${artist.image[2]['#text']}" alt="${artist.name}">
            <h3>${artist.name}</h3>
            <p>${artist.listeners} listeners</p>
        `;
        container.appendChild(card);
    });

    const albumHeader = document.createElement('h3');
    albumHeader.textContent = 'Albums';
    albumHeader.classList.add('top-results-header');
    container.appendChild(albumHeader);

    topAlbums.forEach(album => {
        const card = document.createElement('div');
        card.className = 'top-result-card album-card';
        card.innerHTML = `
            <img class="album-image" src="${album.image[2]['#text']}" alt="${album.name}">
            <h3>${album.name}</h3>
            <p>${album.artist}</p>
        `;
        container.appendChild(card);
    });

    const trackHeader = document.createElement('h3');
    trackHeader.textContent = 'Tracks';
    trackHeader.classList.add('top-results-header');
    container.appendChild(trackHeader)

    topTracks.forEach(track => {
        const card = document.createElement('div');
        card.className = 'top-result-card track-card';
        card.innerHTML = `
            <img class="album-image" src="${track.image[2]['#text']}" alt="${track.name}">
            <h3>${track.name}</h3>
            <p>${track.artist}</p>
        `;
        container.appendChild(card);
    });
}

function setupTabs() {
    const tabs = document.querySelectorAll('.tab');
    const sections = document.querySelectorAll('.results-section');

    function showSection(tab) {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        sections.forEach(s => s.classList.remove('active'));

        const target = tab.getAttribute('data-tab');
        const selectedSection = document.getElementById(`${target}-section`);
        if (selectedSection) {
            selectedSection.classList.add('active');
        }
    }

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            showSection(tab);
        });
    });

    const activeTab = document.querySelector('.tab.active');
    if (activeTab) {
        showSection(activeTab);
    }
}