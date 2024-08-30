/*
 * Irakur - Learn languages through immersion
 * Copyright (C) 2023-2024 Ander Aginaga San Sebastián (a.k.a. Laquin or Laquinh)
 * Licensed under version 3 of the GNU Affero General Public License
 */

import React, { useState } from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';

import { backendConnector } from '../../backend-connector';
import { getPartialTemplate } from '../../language-templates';

const AddLanguageForm = (
	{
		targetLanguageName,
		auxiliaryLanguageName
	}: {
		targetLanguageName: string,
		auxiliaryLanguageName: string
	}
): JSX.Element => {
	const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

	const languageTemplate = getPartialTemplate(targetLanguageName, auxiliaryLanguageName);

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
			form.get('sentenceDelimiters') as string,
			form.get('whitespaces') as string,
			form.get('intrawordPunctuation') as string
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
				<input type="text" name="name" id="name" defaultValue={languageTemplate.translatedName}/>
				<br />
				<label htmlFor="dictionaryUrl">Dictionary URL</label>
				<input
					type="text"
					name="dictionaryUrl"
					id="dictionaryUrl"
					defaultValue={languageTemplate.dictionaryUrl}
				/>
				<br />
				<label htmlFor="shouldShowSpaces">Show spaces</label>
				<input
					type="checkbox"
					name="shouldShowSpaces"
					id="shouldShowSpaces"
					defaultChecked={languageTemplate.shouldShowSpaces}
				/>
				<br />
				<label htmlFor="alphabet">Alphabet</label>
				<input type="text" name="alphabet" id="alphabet" defaultValue={languageTemplate.alphabet}/>
				<br />
				<label htmlFor="sentenceDelimiters">Sentence delimiters</label>
				<input
					type="text"
					name="sentenceDelimiters"
					id="sentenceDelimiters"
					defaultValue={languageTemplate.sentenceDelimiters}
				/>
				<br />
				<label htmlFor="whitespaces">Whitespaces</label>
				<input type="text" name="whitespaces" id="whitespaces" defaultValue={languageTemplate.whitespaces}/>
				<br />
				<label htmlFor="intrawordPunctuation">Intraword punctuation</label>
				<input
					type="text"
					name="intrawordPunctuation"
					id="intrawordPunctuation"
					defaultValue={languageTemplate.intrawordPunctuation}
				/>
				<br />

				<button type="submit" disabled={isSubmitting}>Add</button>
			</form>
		</HelmetProvider>
	);
};

export { AddLanguageForm };
