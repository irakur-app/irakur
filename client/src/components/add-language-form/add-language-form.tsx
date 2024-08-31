/*
 * Irakur - Learn languages through immersion
 * Copyright (C) 2023-2024 Ander Aginaga San Sebastián (a.k.a. Laquin or Laquinh)
 * Licensed under version 3 of the GNU Affero General Public License
 */

import React, { useState } from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';

import { backendConnector } from '../../backend-connector';
import { getPartialTemplate } from '../../language-templates';

type Script = {
	alphabet: string;
	sentenceDelimiters: string;
	whitespaces: string;
	intrawordPunctuation: string;
};

const scripts: Record<string, Script> = {
	'Latin': {
		alphabet: '[a-zA-Z\\u00C0-\\u024F\\u1E00-\\u1EFF]',
		sentenceDelimiters: '[!.?…]',
		whitespaces: '[\\s\\u0085\\u2001-\\u2009\\u200B]',
		intrawordPunctuation: '',
	},
	'Japanese': {
		alphabet: '[一-龠]+|[ぁ-ゔ]+|[ァ-ヴー]+|[々〆〤ヶ]+',
		sentenceDelimiters: '[!.?…。．？｡！]',
		whitespaces: '[\\s\\u0085\\u2001-\\u2009\\u200B]',
		intrawordPunctuation: '',
	},
};

const AddLanguageForm = (
	{
		targetLanguageName,
		auxiliaryLanguageName
	}: {
		targetLanguageName: string | null,
		auxiliaryLanguageName: string | null
	}
): JSX.Element => {
	const languageTemplate = getPartialTemplate(targetLanguageName, auxiliaryLanguageName);

	const [scriptValues, setScriptValues] = useState<Script>(
		{
			alphabet: languageTemplate.alphabet || scripts['Latin'].alphabet,
			sentenceDelimiters: languageTemplate.sentenceDelimiters || scripts['Latin'].sentenceDelimiters,
			whitespaces: languageTemplate.whitespaces || scripts['Latin'].whitespaces,
			intrawordPunctuation: languageTemplate.intrawordPunctuation || scripts['Latin'].intrawordPunctuation,
		}
	);

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
			form.get('sentenceDelimiters') as string,
			form.get('whitespaces') as string,
			form.get('intrawordPunctuation') as string,
			(targetLanguageName || '') + ':' + (auxiliaryLanguageName || '')
		);

		if (wasAdded)
		{
			window.location.href = '/languages';
		}

		setIsSubmitting(false);
	};

	const handleOnChange = (
		event: React.ChangeEvent<HTMLInputElement>,
	): void => {
		const { name, value } = event.target;

		setScriptValues(
			{
				...scriptValues,
				[name]: value
			}
		);
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
				<br />

				<label htmlFor="script">Script</label>
				<select
					defaultValue={languageTemplate.script || 'Latin'}
					onChange={
						(event): void => {
							if (event.target === null)
							{
								return;
							}

							if (Object.keys(scripts).includes(event.target.value))
							{
								const script = scripts[event.target.value];
								
								setScriptValues(script);
							}
						}
					}
				>
					<option value="">Select a script</option>
					<option value="Japanese">Japanese (kana + kanji)</option>
					<option value="Latin">Latin</option>
				</select>
				<br />
				<br />
				<label htmlFor="alphabet">Alphabet</label>
				<input
					type="text"
					name="alphabet"
					id="alphabet"
					value={scriptValues.alphabet}
					onChange={handleOnChange}
				/>
				<br />
				<label htmlFor="sentenceDelimiters">Sentence delimiters</label>
				<input
					type="text"
					name="sentenceDelimiters"
					id="sentenceDelimiters"
					value={scriptValues.sentenceDelimiters}
					onChange={handleOnChange}
				/>
				<br />
				<label htmlFor="whitespaces">Whitespaces</label>
				<input
					type="text"
					name="whitespaces"
					id="whitespaces"
					value={scriptValues.whitespaces}
					onChange={handleOnChange}
				/>
				<br />
				<label htmlFor="intrawordPunctuation">Intraword punctuation</label>
				<input
					type="text"
					name="intrawordPunctuation"
					id="intrawordPunctuation"
					value={scriptValues.intrawordPunctuation}
					onChange={handleOnChange}
				/>
				<br />
				<br />

				<button type="submit" disabled={isSubmitting}>Add</button>
			</form>
		</HelmetProvider>
	);
};

export { AddLanguageForm };
