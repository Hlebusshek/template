import React, { useEffect, useState } from 'react';
import { fetchTrackGenres } from '../api/lastfmApi';
import '../styles/item.css';

const fallbackImage = 'https://via.placeholder.com/150 ';

const TrackItem = ({ track }) => {
    const [genres, setGenres] = useState([]);

    useEffect(() => {
        const loadGenres = async () => {
            if (track?.name && track?.artist) {
                try {
                    const result = await fetchTrackGenres(track);
                    setGenres(result);
                } catch (error) {
                    console.error('Ошибка получения жанров:', error);
                    setGenres(['No genre']);
                }
            }
        };

        loadGenres();
    }, [track]);

    const imageUrl = track.image?.[0]?.['#text'] || fallbackImage;

    // Исправляем доступ к artist.name
    const artistName = typeof track.artist === 'string'
        ? track.artist
        : track.artist?.name || 'Unknown artist';

    return (
        <div className="track-item">
            <img
                alt="Track"
                className="track-image"
                src={imageUrl}
            />
            <div className="track-info">
                <h3 className="track-title">{track.name}</h3>
                <p className="artist-name">{artistName}</p>
                <p className="track-genres">{genres.join(' · ')}</p>
            </div>
        </div>
    );
};

export default TrackItem;