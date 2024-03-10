/* 
 * Irakur - Learn languages through immersion
 * Copyright (C) 2023-2024 Ander "Laquin" Aginaga San Sebastián
 * Licensed under version 3 of the GNU Affero General Public License
 */

import React, { useState, useEffect } from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';

type ApiData = {
	title: string;
};

const AddText = () => {
	const [apiData, setApiData] = useState<ApiData | null>(null);

	useEffect(() => {
		fetch('/api/texts/add')
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
			<form method="post" action="/api/texts/add">
				<label htmlFor="title">Title</label>
				<input type="text" name="title" id="title" />
				<br />
				<label htmlFor="content">Content</label>
				<textarea name="content" id="content"></textarea>
				<br />
				<label htmlFor="sourceUrl">URL</label>
				<input type="text" name="sourceUrl" id="sourceUrl" />
				<br />

				<button type="submit">Add</button>
			</form>
		</HelmetProvider>
	);
};

export { AddText };