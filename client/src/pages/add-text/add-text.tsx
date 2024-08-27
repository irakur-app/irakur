/*
 * Irakur - Learn languages through immersion
 * Copyright (C) 2023-2024 Ander Aginaga San Sebastián (a.k.a. Laquin or Laquinh)
 * Licensed under version 3 of the GNU Affero General Public License
 */

import React, { useEffect, useState } from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';

import { Language } from '@common/types';
import { backendConnector } from '../../backend-connector';
import { Loading } from '../../components/loading';

const AddText = (): JSX.Element => {
	const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
	const [languages, setLanguages] = useState<Language[] | null>(null);

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
		event.preventDefault();

		setIsSubmitting(true);

		if (event.target === null)
		{
			return;
		}

		const form = new FormData(event.target as HTMLFormElement);

		const wasEdited: boolean = await backendConnector.addText(
			form.get('title') as string,
			Number(form.get('languageId') as string),
			form.get('content') as string,
			Number(form.get('numberOfPages') as string),
			form.get('sourceUrl') as string,
		);

		if (wasEdited)
		{
			window.location.href = '/texts';
		}

		setIsSubmitting(false);
	};

	useEffect(
		(): void => {
			backendConnector.getLanguages().then(
				(languages: Language[]): void => {
					setLanguages(languages);
				}
			);
		},
		[]
	);

	if (!languages)
	{
		return <Loading />;
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
				<select name="languageId" id="languageId">
					<option value="">Select language</option>
					{
						languages.map(
							(language: Language) =>(
								<option key={language.id} value={language.id}>{language.name}</option>
							)
						)
					}
				</select>
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
