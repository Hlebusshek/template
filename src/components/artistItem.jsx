import React, { useEffect, useState } from 'react';
import { fetchArtistGenres } from '../api/lastfmApi';
import '../styles/item.css';

const ArtistItem = ({ artist }) => {
  const [genres, setGenres] = useState([]);

    useEffect(() => {
        const loadGenres = async () => {
            if (artist?.name) {
                try {
                    const result = await fetchArtistGenres(artist);
                    setGenres(result);
                } catch (error) {
                    console.error('Ошибка загрузки жанров:', error);
                    setGenres(['No genre']);
                }
            }
        };

        loadGenres();
    }, [artist]);
  console.log(artist);
  const imageUrl = artist.image[0]['#text'] || '';

  return (
    <div className="artist-item">
      <img className="artist-image" src={imageUrl} alt={artist.name || 'Artist'}/>
      <h3 className="artist-name">{artist.name || 'Artist'}</h3>
      <p className="artist-genres">{genres.join(' · ')}</p>
    </div>
  );
};

export default ArtistItem;