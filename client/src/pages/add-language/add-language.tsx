/* 
 * Irakur - Learn languages through immersion
 * Copyright (C) 2023-2024 Ander "Laquin" Aginaga San Sebastián
 * Licensed under version 3 of the GNU Affero General Public License
 */

import React, { useState, useEffect } from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { backendConnector } from '../../backend-connector';

const AddLanguage = () => {
	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleSubmit = async (event: any) => {
		event.preventDefault();

		setIsSubmitting(true);
		
		const wasAdded = await backendConnector.addLanguage(
			event.target.name.value,
			event.target.dictionaryUrl.value,
			event.target.shouldShowSpaces.checked
		)

		if (wasAdded)
		{
			window.location.href = '/languages';
		}

		setIsSubmitting(false);
	}

	return (
		<HelmetProvider>
			<Helmet>
				<title>Irakur - Add language</title>
			</Helmet>
			<h1>Irakur - Add language</h1>
			<form method="post" onSubmit={handleSubmit}>
				<label htmlFor="name">Name</label>
				<input type="text" name="name" id="name" />
				<br />
				<label htmlFor="dictionaryUrl">Dictionary URL</label>
				<input type="text" name="dictionaryUrl" id="dictionaryUrl" />
				<br />
				<label htmlFor="shouldShowSpaces">Show spaces</label>
				<input type="checkbox" name="shouldShowSpaces" id="shouldShowSpaces" />
				<br />

				<button type="submit" disabled={isSubmitting}>Add</button>
			</form>
		</HelmetProvider>
	);
};

export { AddLanguage };