/* 
 * Irakur - Learn languages through immersion
 * Copyright (C) 2023-2024 Ander "Laquin" Aginaga San Sebastián
 * Licensed under version 3 of the GNU Affero General Public License
 */

import React, { useState, useEffect } from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { backendConnector } from '../../backend-connector';

const AddText = () => {
	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleSubmit = async (event: any) => {
		event.preventDefault();

		setIsSubmitting(true);
		
		const wasEdited = await backendConnector.addText(
			event.target.title.value,
			event.target.languageId.value,
			event.target.content.value,
			event.target.numberOfPages.value,
			event.target.sourceUrl.value,
		);

		if (wasEdited)
		{
			window.location.href = '/texts';
		}

		setIsSubmitting(false);
	}

	// Render your React components using the fetched data
	return (
		<HelmetProvider>
			<Helmet>
				<title>Irakur - Add text</title>
			</Helmet>
			<h1>Irakur - Add text</h1>
			<form method="post" onSubmit={handleSubmit}>
				<label htmlFor="title">Title</label>
				<input type="text" name="title" id="title" />
				<br />
				<label htmlFor="languageId">Language</label>
				<input type="text" name="languageId" id="languageId" />
				<br />
				<label htmlFor="content">Content</label>
				<textarea name="content" id="content" />
				<br />
				<label htmlFor="numberOfPages">Number of pages</label>
				<input type="text" name="numberOfPages" id="numberOfPages" />
				<br />
				<label htmlFor="sourceUrl">Source URL</label>
				<input type="text" name="sourceUrl" id="sourceUrl" />
				<br />
				<button type="submit" disabled={isSubmitting}>Add</button>
			</form>
		</HelmetProvider>
	);
};

export { AddText };