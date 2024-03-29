/* 
 * Irakur - Learn languages through immersion
 * Copyright (C) 2023-2024 Ander "Laquin" Aginaga San Sebastián
 * Licensed under version 3 of the GNU Affero General Public License
 */

import React, { useState, useEffect } from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { backendConnector } from '../../backend-connector';
import { Loading } from '../../components/loading';

const EditLanguage = () => {
	const [languageData, setLanguageData] = useState<any | null>(null);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const languageId = Number(document.location.pathname.split('/').pop());

	useEffect(() => {
		backendConnector.getLanguage(languageId).then((data) => {
			setLanguageData(data);
		});
	}, [languageId]);

	const handleSubmit = async (event: any) => {
		event.preventDefault();

		setIsSubmitting(true);

		console.log(event.target.shouldShowSpaces.checked);
		
		const wasEdited = await backendConnector.editLanguage(
			event.target.id.value,
			event.target.name.value,
			event.target.dictionaryUrl.value,
			event.target.shouldShowSpaces.checked
		);

		if (wasEdited)
		{
			window.location.href = '/languages';
		}

		setIsSubmitting(false);
	}

	if (!languageData) {
		return <Loading />;
	}

	return (
		<HelmetProvider>
			<Helmet>
				<title>Irakur - Edit language</title>
			</Helmet>
			<h1>Irakur - Edit language</h1>
			<form method="post" onSubmit={handleSubmit}>
				<input type="hidden" name="id" defaultValue={languageData.id}/>
				<label htmlFor="name">Name</label>
				<input type="text" name="name" id="name" defaultValue={languageData.name}/>
				<br />
				<label htmlFor="dictionaryUrl">Dictionary</label>
				<input type="text" name="dictionaryUrl" id="dictionaryUrl" defaultValue={languageData.dictionary_url}/>
				<br />
				<label htmlFor="shouldShowSpaces">Show spaces</label>
				<input type="checkbox" name="shouldShowSpaces" id="shouldShowSpaces" defaultChecked={languageData.should_show_spaces}/>

				<button type="submit" disabled={isSubmitting}>Update</button>
			</form>
		</HelmetProvider>
	);
};

export { EditLanguage };