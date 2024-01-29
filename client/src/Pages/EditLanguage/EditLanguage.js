/* 
 * Irakur - Learn languages through immersion
 * Copyright (C) 2023-2024 Ander "Laquin" Aginaga San Sebastián
 * Licensed under version 3 of the GNU Affero General Public License
 */

import React, { useState, useEffect } from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';

const EditLanguage = () => {
  const [apiData, setApiData] = useState(null);

  const languageId = document.location.pathname.split('/').pop();

  useEffect(() => {
    fetch('/api/languages/edit/' + languageId + '/')
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
      <form method="post" action="/api/languages/edit">
          <input type="hidden" name="id" defaultValue={apiData.language.id}/>
          <label htmlFor="name">Name</label>
          <input type="text" name="name" id="name" defaultValue={apiData.language.name}/>
          <label htmlFor="dictionaryUrl">Dictionary</label>
          <input type="text" name="dictionaryUrl" id="dictionaryUrl" defaultValue={apiData.language.dictionary_url}/>
          <label htmlFor="shouldShowSpaces">Show spaces</label>
          <input type="checkbox" name="shouldShowSpaces" id="shouldShowSpaces" defaultChecked={apiData.language.should_show_spaces}/>

          <button type="submit">Add</button>
      </form>
    </HelmetProvider>
  );
};

export { EditLanguage };