/*
 * Irakur - Learn languages through immersion
 * Copyright (C) 2023-2024 Ander "Laquin" Aginaga San Sebastián
 * Licensed under version 3 of the GNU Affero General Public License
 */

import React, { useEffect, useState } from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { Outlet } from 'react-router-dom';

import { ReducedWordData, Text } from '@common/types';
import { backendConnector } from '../../backend-connector';
import { Loading } from '../../components/loading';

const statusStyles: Record<string, string> = {
	'0': '#ADDFF4FF',
	'1': '#F5B8A9FF',
	'2': '#F5CCA9E5',
	'3': '#F5E1A9BF',
	'4': '#F5F3A99F',
	'5': '#DDFFDD7F',
	'99': '#FFFFFF00',
	'98': '#FFFFFF00',
}

const getStyle = (status: number): string => {
	return statusStyles[status.toString()] || '#FFFFFF00';
}

const Reader = (
	{
		languageId,
		shouldShowSpaces,
		onWordClick
	}: {
		languageId: number,
		shouldShowSpaces: boolean,
		onWordClick: (content: string, onWordUpdate: () => (content: string, status: number) => void) => void
	}
): JSX.Element => {
	const [currentPage, setCurrentPage] = useState<number>(1);
	const [words, setWords] = useState<ReducedWordData[]|null>(null);

	const textId = Number(document.location.pathname.split('/').pop());
	const [numberOfPages, setNumberOfPages] = useState<number|null>(null);

	const loadPage = (textId: number, pageId: number): void => {
		backendConnector.getWords(textId, pageId).then(
			(words: ReducedWordData[]): void => {
				setWords(words);
			}
		);
		setCurrentPage(pageId);
	}

	const addWordsInBatch = async (
		status: number,
		lastIndex: number | null,
		contentException: string | null
	): Promise<void> => {
		if (lastIndex === null)
		{
			lastIndex = words!.length;
		}
		const wordBank = words?.slice(0, lastIndex);

		let newWordContents: string[] = wordBank!.filter(
			(word: ReducedWordData): boolean => {
				return word.status === 0 && word.content !== contentException;
			}
		).map(
			(word: ReducedWordData): string => {
				return word.content.toLowerCase();
			}
		);

		if (newWordContents.length === 0)
		{
			return;
		}

		newWordContents = [...new Set(newWordContents)];

		const updatedWords = words;
		for (const word of updatedWords!)
		{
			if (newWordContents.includes(word.content.toLowerCase()) && word.type === "word")
			{
				console.log(word.content);
				word.status = status;
			}
		}
		setWords(updatedWords);

		await backendConnector.addWordsInBatch(languageId, newWordContents, status, new Date().toISOString()).then(
			(): void => {
				for (const content of newWordContents)
				{
					const wordElements = document.getElementsByClassName(
						'word-' + content?.toLowerCase()
					) as HTMLCollectionOf<HTMLElement>;
					
					for (let i = 0; i < wordElements.length; i++)
					{
						wordElements[i].style.transition = "background-color 2s ease-out";
						wordElements[i].style.backgroundColor = getStyle(status);
					}
				}
			}
		);
	}

	const onWordUpdate = (index: number, content: string, status: number): void => {
		//console.log(words);

		const updatedWords = words;
		for (const word of updatedWords!)
		{
			if (word.content.toLowerCase() === content.toLowerCase())
			{
				word.status = status;
			}
		}

		setWords(updatedWords);

		const wordElements = document.getElementsByClassName(
			'word-' + content?.toLowerCase()
		) as HTMLCollectionOf<HTMLElement>;
		
		for (let i = 0; i < wordElements.length; i++)
		{
			wordElements[i].style.transition = "background-color 0.3s ease-out";
			wordElements[i].style.backgroundColor = getStyle(status);
		}

		addWordsInBatch(99, index, content);
	};

	useEffect(
		(): void => {
			backendConnector.getText(textId).then(
				(text: Text): void => {
					setNumberOfPages(text.numberOfPages??null);
				}
			)
			loadPage(textId, currentPage);

			// For some reason, the first animation glitches.
			// We force this invisible animation so the subsequent ones work.
			const animationFixers = document.getElementsByClassName('animation-fixer') as HTMLCollectionOf<HTMLElement>;
			if(animationFixers.length > 0)
			{
				animationFixers[0].style.transition = "background-color 0.5s ease-out";
				animationFixers[0].style.backgroundColor = getStyle(99);
			}
		},
		[]
	);

	//const spaceStyle: React.CSSProperties = { fontSize: (shouldShowSpaces ? undefined : 0) };
	const spaceRender: JSX.Element = (shouldShowSpaces) ? <span>{' '}</span> : (
		<span
			style={{
				fontSize: 0,
			}}
		>
			{' '}
		</span>
	);

	const renderWord = (word: ReducedWordData, index: number): JSX.Element => {
		let renderedElement;
		if (word.content === ' ')
		{
			renderedElement = spaceRender;
		}
		else if (word.content === '\n')
		{
			renderedElement = <br key={index} style={{ marginBottom: "1rem" }}/>;
		}
		else if (word.type === 'punctuation')
		{
			renderedElement = <span key={index}>{word.content}</span>;
		}
		else
		{
			const onWordUpdateCallback = () => (content: string, status: number) => {
				onWordUpdate(index, content, status);
			}
			renderedElement = (
				<span
					key={index}
					className={"word-" + word.content.toLowerCase()}
					style={{
						backgroundColor: getStyle(word.status??98),
						borderRadius: ".25rem",
						cursor: "pointer",
					}}
					onClick={
						(): void => {
							onWordClick(word.content, onWordUpdateCallback);
						}
					}
				>{word.content}</span>
			);
		}
		return renderedElement;
	}

	if (!words || !numberOfPages)
	{
		return <Loading />;
	}

	return (
		<div>
			<span className="animation-fixer" style={{ backgroundColor: getStyle(98) }}></span>
			<div>
				{
					words.map(renderWord)
				}
			</div>
			<div>
				<button
					disabled={currentPage === 1}
					onClick={(): void => {loadPage(textId, currentPage-1)}}
				>Previous page</button>
				<button
					disabled={currentPage === numberOfPages}
					onClick={
						async (): Promise<void> => {
							await addWordsInBatch(99, null, null);
							loadPage(textId, currentPage+1);
						}
					}
				>Next page</button>
			</div>
		</div>
	);
};

export { Reader };
