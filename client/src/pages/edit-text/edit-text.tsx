/* 
 * Irakur - Learn languages through immersion
 * Copyright (C) 2023-2024 Ander "Laquin" Aginaga San Sebastián
 * Licensed under version 3 of the GNU Affero General Public License
 */

import { Text, Page } from '../../../../common/types';

import React, { useState, useEffect } from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { backendConnector } from '../../backend-connector';
import { Loading } from '../../components/loading';


const EditText = (): JSX.Element => {
	const [textData, setTextData] = useState<Text | null>(null);
	const [pageData, setPageData] = useState<Page[] | null>(null);
	const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

	const textId = Number(document.location.pathname.split('/').pop());

	useEffect(() => {
		backendConnector.getText(textId).then((data: Text) => {
			setTextData(data);
			console.log(data);
			backendConnector.getPages(data.id).then((data: Page[]) => {
				setPageData(data);
				console.log(data);
			})
		});
	}, [textId]);

	const handleSubmit = async (event: any) => {
		event.preventDefault();

		setIsSubmitting(true);

		console.log(event.target.id)
		
		const wasEdited: boolean = await backendConnector.editText(
			event.target.id.value,
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

	if (!textData || !pageData) {
		return <Loading />;
	}

	const textContent: string = pageData.map((page: Page) => page.content).join('');

	return (
		<HelmetProvider>
			<Helmet>
				<title>Irakur - Edit text</title>
			</Helmet>
			<h1>Irakur - Edit text</h1>
			<form method="post" onSubmit={handleSubmit}>
				<input type="hidden" name="id" defaultValue={textData.id}/>
				<label htmlFor="title">Title</label>
				<input type="text" name="title" id="title" defaultValue={textData.title}/>
				<br />
				<label htmlFor="languageId">Language</label>
				<input type="text" name="languageId" id="languageId" defaultValue={textData.language_id}/>
				<br />
				<label htmlFor="content">Content</label>
				<textarea name="content" id="content" defaultValue={textContent}/>
				<br />
				<label htmlFor="numberOfPages">Number of pages</label>
				<input type="text" name="numberOfPages" id="numberOfPages" defaultValue={pageData.length}/>
				<br />
				<label htmlFor="sourceUrl">Source URL</label>
				<input type="text" name="sourceUrl" id="sourceUrl" defaultValue={textData.source_url}/>
				<br />
				<button type="submit" disabled={isSubmitting}>Update</button>
			</form>
		</HelmetProvider>
	);
};

export { EditText };