/* 
 * Irakur - Learn languages through immersion
 * Copyright (C) 2023-2024 Ander "Laquin" Aginaga San Sebastián
 * Licensed under version 3 of the GNU Affero General Public License
 */

import React, { useState, useEffect } from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';

type ApiData = {
  title: string;
  links: {
    name: string;
    url: string;
  }[];
  languages: {
    id: number;
    name: string;
  }[];
  activeLanguage: {
    id: number;
  } | null;
};

const Home = () => {
  const [apiData, setApiData] = useState<ApiData | null>(null);

  useEffect(() => {
    fetch('/api/home')
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
      <h3>Active language:</h3>
      <form id="activeLanguageForm" method="post">
          <select id="activeLanguage" name="activeLanguage" defaultValue={apiData.activeLanguage?.id}>
              <option value="" disabled hidden>Select language</option>
              {apiData.languages.map((language, i) => (
                <option value={language.id} key={language.id}>{language.name}</option>
              ))}
          </select>
      </form>
      {apiData.links.map((link, i) => (
        <React.Fragment key={i}>
          <a href={link.url}>{link.name}</a>
          <br />
        </React.Fragment>
      ))}
    </HelmetProvider>
  );
};

export { Home };