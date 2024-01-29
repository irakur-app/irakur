/* 
 * Irakur - Learn languages through immersion
 * Copyright (C) 2023-2024 Ander "Laquin" Aginaga San Sebastián
 * Licensed under version 3 of the GNU Affero General Public License
 */

import React, { useState, useEffect } from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';

type ApiData = {
  title: string;
  text: {
    id: number;
    title: string;
    content: string;
    source_url: string;
  };
};

const EditText = () => {
  const [apiData, setApiData] = useState<ApiData | null>(null);

  const textId = document.location.pathname.split('/').pop();

  useEffect(() => {
    fetch('/api/texts/edit/' + textId + '/')
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
      <form method="post" action="/api/texts/edit">
          <input type="hidden" name="id" value={apiData.text.id}/>
          <label htmlFor="title">Title</label>
          <input type="text" name="title" id="title" defaultValue={apiData.text.title}/>
          <label htmlFor="content">Text</label>
          <textarea name="content" id="content" defaultValue={apiData.text.content} />
          <label htmlFor="sourceUrl">URL</label>
          <input type="text" name="sourceUrl" id="sourceUrl" defaultValue={apiData.text.source_url}/>

          <button type="submit">Add</button>
      </form>
    </HelmetProvider>
  );
};

export { EditText };