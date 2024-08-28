/*
 * Irakur - Learn languages through immersion
 * Copyright (C) 2023-2024 Ander Aginaga San Sebastián (a.k.a. Laquin or Laquinh)
 * Licensed under version 3 of the GNU Affero General Public License
 */

import React, { useState } from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';

import { backendConnector } from '../../backend-connector';

const AddLanguage = (): JSX.Element => {
	const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
		event.preventDefault();

		setIsSubmitting(true);

		if (event.target === null)
		{
			return;
		}

		const form = new FormData(event.target as HTMLFormElement);

		const wasAdded: boolean = await backendConnector.addLanguage(
			form.get('name') as string,
			form.get('dictionaryUrl') as string,
			(form.get('shouldShowSpaces') as string) === 'on',
			form.get('alphabet') as string,
			form.get('sentenceDelimiters') as string
		);

		if (wasAdded)
		{
			window.location.href = '/languages';
		}

		setIsSubmitting(false);
	};

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
				<label htmlFor="alphabet">Alphabet</label>
				<input type="text" name="alphabet" id="alphabet" />
				<br />
				<label htmlFor="sentenceDelimiters">Sentence delimiters</label>
				<input type="text" name="sentenceDelimiters" id="sentenceDelimiters" />
				<br />

				<button type="submit" disabled={isSubmitting}>Add</button>
			</form>
		</HelmetProvider>
	);
};

export { AddLanguage };
