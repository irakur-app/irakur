/* 
 * Irakur - Learn languages through immersion
 * Copyright (C) 2023-2024 Ander "Laquin" Aginaga San Sebastián
 * Licensed under version 3 of the GNU Affero General Public License
 */

import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Helmet, HelmetProvider } from 'react-helmet-async';

type ApiData = {
  title: string;
  languages: {
    id: number;
    name: string;
  }[];
};

const Languages = () => {
  const [apiData, setApiData] = useState<ApiData | null>(null);

  useEffect(() => {
    fetch('/api/languages')
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
      <a href="/languages/add">Add language</a>
      {apiData.languages.map((language, i) => (
        <React.Fragment key={i}>
          <p>{language.name}</p>
          <a href={"/languages/edit/" + language.id}>Edit</a>
          <form method="post" action="/api/languages/delete">
            <input type="hidden" name="id" value={language.id} />
            <button type="submit">Delete</button>
          </form>
        </React.Fragment>
      ))}

      <Outlet />
    </HelmetProvider>
  );
};

export { Languages };