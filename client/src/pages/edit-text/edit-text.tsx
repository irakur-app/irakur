/* 
 * Irakur - Learn languages through immersion
 * Copyright (C) 2023-2024 Ander "Laquin" Aginaga San Sebastián
 * Licensed under version 3 of the GNU Affero General Public License
 */

import { Text, Page } from '@common/types';

import React, { useState, useEffect } from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { backendConnector } from '../../backend-connector';
import { Loading } from '../../components/loading';


const EditText = (): JSX.Element => {
	const [textData, setTextData] = useState<Text | null>(null);
	const [pageData, setPageData] = useState<Page[] | null>(null);
	const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

	const textId = Number(document.location.pathname.split('/').pop());

	useEffect((): void => {
		backendConnector.getText(textId).then((data: Text): void => {
			setTextData(data);
			backendConnector.getPages(data.id).then((data: Page[]): void => {
				setPageData(data);
			})
		});
	}, [textId]);

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
		event.preventDefault();

		setIsSubmitting(true);

		if(event.target === null)
		{
			return;
		}

		const form = new FormData(event.target as HTMLFormElement);

		const wasEdited: boolean = await backendConnector.editText(
			Number(form.get('id') as string),
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