import React, { useEffect, useState } from 'react';
import Header from '../components/header';
import Footer from '../components/footer';
import ArtistItem from '../components/artistItem';
import TrackItem from '../components/trackItem';
import { fetchTopArtists, fetchTopTracks} from '../api/lastfmApi';
import '../styles/homePage.css';

const HomePage = () => {
    const [artists, setArtists] = useState([]);
    const [tracks, setTracks] = useState([]);

    useEffect(() => {
        const loadContent = async () => {
            const topArtists = await fetchTopArtists(12);
            const topTracks = await fetchTopTracks(18);

            console.log("topArtists", topArtists);
            console.log("topTracks", topTracks);

            await setArtists(topArtists);
            await setTracks(topTracks);
        };

        loadContent();
    }, []);

    return (
        <>
            <Header />
            <main className="site-content">
                <h1 className="page-title">Music</h1>
                <section className="hot-artists">
                    <h2 className="section-title">Hot Right Now</h2>
                    <div className="artists-grid">
                        {Array.isArray(artists) && artists.length > 0 ? (
                            artists.map((artist, i) => (
                                <ArtistItem key={i} artist={artist} />
                            ))
                            ) : (
                            <p>Нет артистов для отображения</p>
                        )}
                    </div>
                </section>
                <section className="popular-tracks">
                    <h2 className="section-title">Popular tracks</h2>
                    <div className="tracks-grid">
                        {Array.isArray(tracks) && tracks.length > 0 ? (
                            tracks.map((track, i) => (
                                <TrackItem key={i} track={track} />
                            ))
                            ) : (
                            <p>Нет треков для отображения</p>
                        )}
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
};
export default HomePage;