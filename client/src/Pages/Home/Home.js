import React, { useState, useEffect, Fragment } from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';

const Home = () => {
  const [homeData, setHomeData] = useState(null);

  useEffect(() => {
    fetch('/api/home')
      .then((response) => response.json())
      .then((data) => setHomeData(data))
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  if (!homeData) {
    return <p>Loading...</p>;
  }

  // Render your React components using the fetched data
  return (
    <HelmetProvider>
      <Helmet>
        <title>{homeData.title}</title>
      </Helmet>
      <h1>{homeData.title}</h1>
      <h3>Active language:</h3>
      <form id="activeLanguageForm" method="post">
          <select id="activeLanguage" name="activeLanguage" defaultValue={homeData.activeLanguage?.id}>
              <option value="" disabled hidden>Select language</option>
              {homeData.languages.map((language, i) => (
                <option value={language.id} key={language.id}>{language.name}</option>
              ))}
          </select>
      </form>
      {homeData.links.map((link, i) => (
        <Fragment key={i}>
          <a href={link.url}>{link.name}</a>
          <br />
        </Fragment>
      ))}
    </HelmetProvider>
  );
};

export { Home };