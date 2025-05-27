// src/pages/SearchPage.jsx
import React, { useState } from 'react';
import Header from '../components/header';
import Footer from '../components/footer';
import SearchForm from '../components/searchForm';
import ArtistItem from '../components/artistItem';
import TrackItem from '../components/trackItem';
import AlbumItem from '../components/albumItem';
import { searchArtists, searchAlbums, searchTracks } from '../api/lastfmApi';
import '../styles/searchPage.css';

const SearchPage = () => {
    const [activeTab, setActiveTab] = useState('top-results');
    const [query, setQuery] = useState('');
    const [artists, setArtists] = useState([]);
    const [albums, setAlbums] = useState([]);
    const [tracks, setTracks] = useState([]);

    const handleSearch = async (searchQuery) => {
        setQuery(searchQuery);

        const [artistsData, albumsData, tracksData] = await Promise.all([
            searchArtists(searchQuery),
            searchAlbums(searchQuery),
            searchTracks(searchQuery)
        ]);

        setArtists(artistsData);
        setAlbums(albumsData);
        setTracks(tracksData);
    };

    return (
        <>
            <Header />
            <main className="search-results">
                <h1>Search results for "<span id="search-query">{query}</span>"</h1>
                <div className="tabs">
                    {['top-results', 'artists', 'albums', 'tracks'].map(tab => (
                        <button
                            key={tab}
                            className={`tab ${activeTab === tab ? 'active' : ''}`}
                            onClick={() => setActiveTab(tab)}
                        >
                            {tab.replace('-', ' ').toUpperCase()}
                        </button>
                    ))}
                </div>
                <SearchForm onSearch={handleSearch} />
                <div className="search-content">
                    {/* Top Results */}
                    <section className={`results-section ${activeTab === 'top-results' ? 'active' : ''}`}>
                        <h2>Top Results</h2>
                        <div className="top-results-grid">
                            {artists.slice(0, 3).map((artist, i) => (
                                <div key={`top-artist-${i}`} className="top-result-card artist-card">
                                    <img className="artist-image" src={artist.image?.[2]?.['#text'] || 'https://via.placeholder.com/150 '} alt={artist.name} />
                                    <h3>{artist.name}</h3>
                                    <p>{artist.listeners || 0} listeners</p>
                                </div>
                            ))}
                            {albums.slice(0, 3).map((album, i) => (
                                <div key={`top-album-${i}`} className="top-result-card album-card">
                                    <img className="album-image" src={album.image?.[2]?.['#text'] || 'https://via.placeholder.com/150 '} alt={album.name} />
                                    <h3>{album.name}</h3>
                                    <p>{album.artist}</p>
                                </div>
                            ))}
                            {tracks.slice(0, 3).map((track, i) => (
                                <div key={`top-track-${i}`} className="top-result-card track-card">
                                    <img className="track-image" src={track.image?.[2]?.['#text'] || 'https://via.placeholder.com/150 '} alt={track.name} />
                                    <div className="track-info">
                                        <h3>{track.name}</h3>
                                        <p>{track.artist.name}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className={`results-section artists ${activeTab === 'artists' ? 'active' : ''}`} id="artists-section">
                        <h2>Artists</h2>
                        <div className="artist-grid" id="artist-results">
                            {artists.map((artist, i) => (
                                <ArtistItem key={i} artist={artist} />
                            ))}
                        </div>
                    </section>

                    {/* Albums */}
                    <section className={`results-section albums ${activeTab === 'albums' ? 'active' : ''}`} id="albums-section">
                        <h2>Albums</h2>
                        <div className="album-grid" id="album-results">
                            {albums.map((album, i) => (
                                <AlbumItem key={i} album={album} />
                            ))}
                        </div>
                    </section>

                    {/* Tracks */}
                    <section className={`results-section tracks ${activeTab === 'tracks' ? 'active' : ''}`} id="tracks-section">
                        <h2>Tracks</h2>
                        <div className="track-list" id="track-results">
                            {tracks.map((track, i) => (
                                <TrackItem key={i} track={track} />
                            ))}
                        </div>
                    </section>
                </div>
            </main>
            <Footer />
        </>
    );
};

export default SearchPage;