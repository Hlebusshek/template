// lastfm-api.js
const API_KEY = '8f4165162ee81d7004aadbb1da257ca3'; // Замените на ваш API-ключ
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

// Функция для создания URL запроса
function createAPIUrl(method, params) {
    const queryString = new URLSearchParams({
        method,
        api_key: API_KEY,
        format: 'json',
        ...params
    });
    
    return `${BASE_URL}?${queryString}`;
}

// Получить топ-артистов
async function fetchTopArtists() {
    const url = createAPIUrl('chart.gettopartists', { limit: 12 });
    
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        const data = await response.json();
        console.log('Данные от API (артисты):', data);

        const artists = Array.isArray(data.artists?.artist)
            ? data.artists.artist.slice(0, 12)
            : [data.artists?.artist].filter(Boolean);

        // Создаем массив промисов
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
                // Возвращаем null для неудачных запросов
                return null;
            }
        });

        // Загружаем все артистов параллельно
        const allArtists = await Promise.all(artistPromises);
        
        // Фильтруем null (неудачные загрузки)
        const successfulArtists = allArtists.filter(Boolean);
        
        return successfulArtists;
    } catch (error) {
        console.error('Ошибка загрузки артистов:', error);
        showError('Не удалось загрузить список артистов.');
        return [];
    }
}

// Получить топ-треки
async function fetchTopTracks() {
   const url = createAPIUrl('chart.gettoptracks', { limit: 18 });
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        const data = await response.json();
        console.log('Данные от API (треки):', data);

        const tracks = Array.isArray(data.tracks?.track)
            ? data.tracks.track.slice(0, 18)
            : [data.tracks?.track].filter(Boolean);
        
        return tracks;
    } catch (error) {
        console.error('Ошибка загрузки треков:', error);
        showError('Не удалось загрузить список треков.');
        return [];
    }
}


// Поиск
async function search(query) {
    if (!query.trim()) {
        showError('Введите поисковый запрос');
        return [];
    }
    
    try {
        const url = createAPIUrl('artist.search', { 
            artist: query,
            limit: 5 
        });
        
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        return data.results.artistmatches.artist;
    } catch (error) {
        console.error('Error searching:', error);
        showError('Ошибка поиска. Проверьте подключение.');
        return [];
    }
}

// Отображение ошибок
function showError(message) {
    const errorElement = document.createElement('div');
    errorElement.className = 'error-message';
    errorElement.textContent = message;
    
    document.body.appendChild(errorElement);
    
    setTimeout(() => {
        errorElement.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        errorElement.classList.remove('show');
        setTimeout(() => {
            errorElement.remove();
        }, 300);
    }, 5000);
}

// Отрисовка артистов
function renderArtists(artists) {
    console.log('Данные от fetchTopArtists():', artists);
    const container = document.querySelector('.artists-grid');
    if (!container) {
        console.error('Элемент .artists-grid не найден');
        return;
    }
    container.innerHTML = '';

    artists.forEach((artist) => {
        // Проверка, что artist существует
        if (!artist) return;
        const tags = artist.tags?.tag || [];
        let genreText = '';

        if (tags.length >= 2) {
            genreText = `${tags[0]?.name || ''} · ${tags[1]?.name || ''}`;
        } else if (tags.length === 1) {
            genreText = tags[0]?.name || '';
        }

        const imageUrl = artist.image?.[0]?.['#text'] || '';
        const artistCard = document.createElement('div');
        artistCard.className = 'artist-item';
        artistCard.innerHTML = `
            <div class="artist-image" style="background-image: url('${imageUrl}')"></div>
            <h3 class="artist-name">${artist.name}</h3>
            <p class="artist-genres">${genreText}</p>
        `;
        container.appendChild(artistCard);
    });
}

async function fetchTrackGenres(track) {
    try {
        const url = createAPIUrl('track.getInfo', {
            artist: track.artist.name,
            track: track.name
        });
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        const data = await response.json();
        const genres = data.track.toptags.tag;
        
        return {
            ...track,
            genres: genres.map(tag => tag.name).slice(0, 2) // Берем первые 2 жанра
        };
    } catch (error) {
        console.error(`Ошибка получения жанров для ${track.name}:`, error);
        return {
            ...track,
            genres: ['No genre']
        };
    }
}

async function fetchTracksWithGenres(tracks) {
    const genrePromises = tracks.map(track => fetchTrackGenres(track));
    return await Promise.all(genrePromises);
}

// Отрисовка треков
async function renderTracks(tracks) {
    const container = document.querySelector('.tracks-grid');
    container.innerHTML = '';

    // Загрузка жанров параллельно
    const tracksWithGenres = await fetchTracksWithGenres(tracks);
    console.log('Данные от fetchTracksWithGenres():', tracksWithGenres);

    tracksWithGenres.forEach((track) => {
        const genreText = track.genres.length > 0 
            ? track.genres.join(' · ') 
            : 'No genre';

        const trackItem = document.createElement('div');
        trackItem.className = 'track-item';
        const imageUrl = track.image?.[0]?.['#text'] || '';
        trackItem.innerHTML = `
            <div class="track-image" style="background-image: url('${imageUrl}')"></div>
            <div class="track-info">
                <h3 class="track-title">${track.name}</h3>
                <p class="artist-name">${track.artist.name}</p>
                <p class="track-genres">${genreText}</p>
            </div>
        `;
        
        container.appendChild(trackItem);
    });
}

// Инициализация
async function init() {
    showLoadingIndicator(true);
    const auth = await api_auth()
    // Активируем форму поиска
    const searchForm = document.querySelector('.search-container');
    if (searchForm) {
        searchForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const input = searchForm.querySelector('input');
            const query = input.value.trim();
            
            if (query) {
                // Перенаправление на страницу поиска
                window.location.href = `./search.html?q=${encodeURIComponent(query)}`;
            }
        });
    }
    const container = document.querySelector('.artists-grid');
    // Загружаем данные при загрузке страницы
    const artists = await fetchTopArtists();
    const tracks = await fetchTopTracks();
    const tracksWithGenres = await fetchTracksWithGenres(tracks);
    
    renderArtists(artists);
    renderTracks(tracksWithGenres);
    showLoadingIndicator(false);
}

function showLoadingIndicator(show) {
    const loader = document.querySelector('.loading-indicator');
    if (!loader) return;

    if (show) {
        loader.classList.add('show');
        loader.style.display = 'block'; // Показываем элемент
    } else {
        loader.classList.remove('show');
        loader.style.display = 'none'; // Скрываем элемент
    }
}

// Запускаем при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    init();
})