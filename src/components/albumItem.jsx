import React, { useEffect, useState } from 'react';
import { fetchAlbumGenres } from '../api/lastfmApi';
import '../styles/item.css';

const AlbumItem = ({ album }) => {
    const [genres, setGenres] = useState([]);
    
    useEffect(() => {
            const loadGenres = async () => {
                if (album?.artist && album.name) {
                    try {
                        const result = await fetchAlbumGenres(album);
                        setGenres(result);
                    } catch (error) {
                        console.error('Ошибка загрузки жанров:', error);
                        setGenres(['No genre']);
                    }
                }
            };
    
            loadGenres();
        }, [album]);

  const imageUrl = album.image?.find(img => img.size === 'large')?.['#text'] || '';

  return (
    <div className="album-item">
            <img alt="Album" className="album-image" src={imageUrl} />
            <div className="album-info">
                <h3 className="album-title">{album.name}</h3>
                <p className="artist-name">{album.artist.name}</p>
                <p className="album-genres">{genres.join(' · ')}</p>
            </div>
        </div>
  );
};

export default AlbumItem;