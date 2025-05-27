import React from 'react';
import HomePage from './pages/homePage';
import SearchPage from './pages/searchPage';

function App() {
  const isSearchPage = window.location.pathname.includes('search');

  return isSearchPage ? <SearchPage /> : <HomePage />;
}

export default App;