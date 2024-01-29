/* 
 * Lingua Immerse - Learn languages through immersion
 * Copyright (C) 2023-2024 Ander "Laquin" Aginaga San Sebastián
 * Licensed under version 3 of the GNU Affero General Public License
 */

import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Helmet, HelmetProvider } from 'react-helmet-async';

const Texts = () => {
  const [apiData, setApiData] = useState(null);

  useEffect(() => {
    fetch('/api/texts')
      .then((response) => response.json())
      .then((data) => setApiData(data))
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  if (!apiData) {
    return <p>Loading...</p>;
  }

  // Render your React components using the fetched data
  return (
    <HelmetProvider>
      <Helmet>
        <title>{apiData.title}</title>
      </Helmet>
      <h1>{apiData.title}</h1>
      <a href="/texts/add">Add text</a>
      {apiData.texts.map((text, i) => (
        <React.Fragment key={i}>
          <p>{text.title}</p>
          <a href={"/texts/edit/" + text.id}>Edit</a>
          <form method="post" action="/api/texts/delete">
            <input type="hidden" name="id" value={text.id} />
            <button type="submit">Delete</button>
          </form>
        </React.Fragment>
      ))}

      <Outlet />
    </HelmetProvider>
  );
};

export { Texts };