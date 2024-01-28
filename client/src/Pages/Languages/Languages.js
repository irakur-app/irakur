import React, { useState, useEffect, Fragment } from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';

const Languages = () => {
  const [languagesData, setLanguagesData] = useState(null);

  useEffect(() => {
    fetch('/api/languages')
      .then((response) => response.json())
      .then((data) => setLanguagesData(data))
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  if (!languagesData) {
    return <p>Loading...</p>;
  }

  // Render your React components using the fetched data
  return (
    <HelmetProvider>
      <Helmet>
        <title>{languagesData.title}</title>
      </Helmet>
      <h1>{languagesData.title}</h1>
      <a href="/languages/add">Add language</a>
      {languagesData.languages.map((language, i) => (
        <Fragment key={i}>
          <p>{language.name}</p>
          <a href={"/languages/edit/" + language.id}>Edit</a>
          <form method="post" action="/api/languages/delete">
            <input type="hidden" name="id" value={language.id} />
            <button type="submit">Delete</button>
          </form>
        </Fragment>
      ))}
    </HelmetProvider>
  );
};

export { Languages };