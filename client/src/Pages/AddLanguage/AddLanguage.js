import React, { useState, useEffect, Fragment } from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';

const AddLanguage = () => {
  const [apiData, setApiData] = useState(null);

  useEffect(() => {
    fetch('/api/languages/add')
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
      <form method="post" action="/api/languages/add">
        <label htmlFor="name">Name</label>
        <input type="text" name="name" id="name" />
        <br />
        <label htmlFor="dictionaryUrl">Dictionary</label>
        <input type="text" name="dictionaryUrl" id="dictionaryUrl" />
        <br />
        <label htmlFor="shouldShowSpaces">Show spaces</label>
        <input type="checkbox" name="shouldShowSpaces" id="shouldShowSpaces" />
        <br />

        <button type="submit">Add</button>
      </form>
    </HelmetProvider>
  );
};

export { AddLanguage };