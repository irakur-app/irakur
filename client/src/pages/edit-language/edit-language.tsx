/*
 * Irakur - Learn languages through immersion
 * Copyright (C) 2023-2024 Ander Aginaga San Sebastián (a.k.a. Laquin or Laquinh)
 * Licensed under version 3 of the GNU Affero General Public License
 */

import React, { useEffect, useState } from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';

import { Language, TextProcessor } from '@common/types';
import { backendConnector } from '../../backend-connector';
import { Loading } from '../../components/loading';
import { TextProcessorColumn } from '../../components/text-processor-column';

const EditLanguage = (): JSX.Element => {
	const [language, setLanguage] = useState<Language | null>(null);
	const [unusedTextProcessors, setUnusedTextProcessors] = useState<TextProcessor[] | null>(null);
	const [usedTextProcessors, setUsedTextProcessors] = useState<TextProcessor[] | null>(null);
	
	const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

	const languageId: number = Number(document.location.pathname.split('/').pop());

	useEffect(
		(): void => {
			backendConnector.getLanguage(languageId).then(
				(language): void => {
					setLanguage(language);
					backendConnector.getTextProcessors().then(
						(textProcessors) => {
							setUnusedTextProcessors(
								textProcessors.filter(
									(textProcessor) => !language.textProcessors.includes(
										textProcessor.pluginId + '/' + textProcessor.id
									)
								)
							);

							const languageTextProcessorFullIds: string[] = JSON.parse(language.textProcessors);
							setUsedTextProcessors(
								languageTextProcessorFullIds.map(
									(textProcessorFullId) => textProcessors.find(
										(textProcessor) => textProcessorFullId ===
											textProcessor.pluginId + '/' + textProcessor.id
									)
								).filter((textProcessor): textProcessor is TextProcessor => textProcessor !== undefined)
							);
						}
					);
				}
			);
		},
		[languageId]
	);

	if (!language || !unusedTextProcessors || !usedTextProcessors)
	{
		return <Loading />;
	}

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
		event.preventDefault();

		setIsSubmitting(true);

		if (event.target === null)
		{
			return;
		}

		const form = new FormData(event.target as HTMLFormElement);

		const wasEdited: boolean = await backendConnector.editLanguage(
			Number(form.get('id') as string),
			form.get('name') as string,
			form.get('dictionaryUrl') as string,
			(form.get('shouldShowSpaces') as string) === 'on',
			form.get('alphabet') as string,
			form.get('sentenceDelimiters') as string,
			form.get('whitespaces') as string,
			form.get('intrawordPunctuation') as string,
			usedTextProcessors.map(
				(textProcessor) => textProcessor.pluginId + '/' + textProcessor.id
			)
		);

		if (wasEdited)
		{
			window.location.href = '/languages';
		}

		setIsSubmitting(false);
	};
	
	const onDragEnd = (result: DropResult): void => {
		const { destination, draggableId, source } = result;

		if (!destination)
		{
			return;
		}

		if (destination.droppableId === source.droppableId && destination.index === source.index)
		{
			return;
		}

		const sourceColumn: TextProcessor[] = source.droppableId === 'Unused Text Processors'
			? unusedTextProcessors
			: usedTextProcessors;
		const destinationColumn: TextProcessor[] = destination.droppableId === 'Unused Text Processors'
			? unusedTextProcessors
			: usedTextProcessors;

		const draggableTextProcessor = sourceColumn?.find(
			(textProcessor) => textProcessor.pluginId + '/' + textProcessor.id === draggableId
		) as TextProcessor;

		sourceColumn.splice(source.index, 1);
		destinationColumn.splice(destination.index, 0, draggableTextProcessor);
	};

	return (
		<HelmetProvider>
			<Helmet>
				<title>Irakur - Edit language</title>
			</Helmet>
			<h1>Irakur - Edit language</h1>
			<form method="post" onSubmit={handleSubmit}>
				<input type="hidden" name="id" defaultValue={language.id}/>
				<label htmlFor="name">Name</label>
				<input type="text" name="name" id="name" defaultValue={language.name}/>
				<br />
				<label htmlFor="dictionaryUrl">Dictionary</label>
				<input type="text" name="dictionaryUrl" id="dictionaryUrl" defaultValue={language.dictionaryUrl}/>
				<br />
				<label htmlFor="shouldShowSpaces">Show spaces</label>
				<input
					type="checkbox"
					name="shouldShowSpaces"
					id="shouldShowSpaces"
					defaultChecked={language.shouldShowSpaces}
				/>
				<br />
				<label htmlFor="alphabet">Alphabet</label>
				<input type="text" name="alphabet" id="alphabet" defaultValue={language.alphabet}/>
				<br />
				<label htmlFor="sentenceDelimiters">Sentence delimiters</label>
				<input
					type="text"
					name="sentenceDelimiters"
					id="sentenceDelimiters"
					defaultValue={language.sentenceDelimiters}
				/>
				<br />
				<label htmlFor="whitespaces">Whitespaces</label>
				<input
					type="text"
					name="whitespaces"
					id="whitespaces"
					defaultValue={language.whitespaces}
				/>
				<br />
				<label htmlFor="intrawordPunctuation">Intraword punctuation</label>
				<input
					type="text"
					name="intrawordPunctuation"
					id="intrawordPunctuation"
					defaultValue={language.intrawordPunctuation}
				/>
				<br />
				<br />

				<DragDropContext onDragEnd={onDragEnd}>
					<TextProcessorColumn columnType='Unused Text Processors' textProcessors={unusedTextProcessors} />
					<TextProcessorColumn columnType='Used Text Processors' textProcessors={usedTextProcessors} />
				</DragDropContext>

				<button type="submit" disabled={isSubmitting}>Update</button>
			</form>
		</HelmetProvider>
	);
};

export { EditLanguage };
