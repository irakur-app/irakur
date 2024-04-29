/*
 * Irakur - Learn languages through immersion
 * Copyright (C) 2023-2024 Ander "Laquin" Aginaga San Sebastián
 * Licensed under version 3 of the GNU Affero General Public License
 */

import { useEffect, useRef, useState } from 'react';
import { v4 as uuid } from 'uuid';

import { Language, ReducedWordData, Text } from '@common/types';
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
		textData,
		languageData,
		onWordClick
	}: {
		textData: Text,
		languageData: Language,
		onWordClick: (content: string, onWordUpdate: () => (content: string, status: number) => void) => void
	}
): JSX.Element => {
	const [currentPage, setCurrentPage] = useState<number>((textData.progress < 1) ? (Math.floor(textData.progress * textData.numberOfPages!) + 1) : 1);
	console.log(Math.floor(textData.progress * textData.numberOfPages!) + 1);
	const [words, setWords] = useState<ReducedWordData[]|null>(null);
	const [selectedWord, setSelectedWord] = useState<HTMLElement | null>(null);

	const ref = useRef<HTMLDivElement>(null);

	console.log("Rendered JSX:", ref.current); // Check if ref.current is null even before the useEffect
	
	ref.current?.addEventListener(
		'mousedown',
		(): void => {
			console.log("mousedown");
			if (selectedWord !== null) {
				selectedWord.style.boxShadow = "none";
			}
			setSelectedWord(null);
		}
	);

	const updateTextStatistics = async (): Promise<void> => {
		const newProgress = currentPage/textData.numberOfPages!;
		const newDatetime = new Date().toISOString();

		const shouldUpdateDatetimeFinished: boolean = (
			currentPage === textData.numberOfPages! && textData.datetimeFinished === null
		);

		console.log("shouldUpdateDatetimeFinished:", shouldUpdateDatetimeFinished);
		console.log("newProgress:", newProgress);

		await backendConnector.editText(
			textData.id,
			undefined,
			undefined,
			undefined,
			undefined,
			undefined,
			undefined,
			(shouldUpdateDatetimeFinished) ? newDatetime : undefined,
			(newProgress > textData.progress) ? newProgress : undefined
		);

		if (shouldUpdateDatetimeFinished)
		{
			textData.datetimeFinished = newDatetime;
		}
		if (newProgress > textData.progress)
		{
			textData.progress = newProgress;
		}
	}

	const loadPage = async (textId: number, pageId: number): Promise<void> => {
		setWords(await backendConnector.getWords(textId, pageId));

		await backendConnector.editText(
			textData.id,
			undefined,
			undefined,
			undefined,
			undefined,
			undefined,
			new Date().toISOString(),
			undefined,
			undefined
		);

		setCurrentPage(pageId);

		document.querySelectorAll<HTMLElement>('.word-span').forEach(
			(element: HTMLElement): void => {
				element.style.transition = "none";
			}
		);
	}

	const addWordsInBatch = async (
		status: number,
		lastIndex: number | null,
		contentException: string | null
	): Promise<void> => {
		const wordBank = words?.slice(0, lastIndex ?? words!.length);

		let newWordContents: string[] = wordBank!.filter(
			(word: ReducedWordData): boolean => {
				return (word.status === 0 || word.status === null) && word.content !== contentException && word.type === "word";
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
				word.status = status;
			}
		}
		setWords(updatedWords);

		await backendConnector.addWordsInBatch(languageData.id, newWordContents, status, new Date().toISOString()).then(
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
			loadPage(textData.id, currentPage);

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
	const spaceRender = (index: number): JSX.Element  =>
	{
		if (languageData.shouldShowSpaces)
		{
			return <span key={index}>{' '}</span>;
		}
		else
		{
			return (
				<span
					key={index}
					style={{
						fontSize: 0,
					}}
				>
					{' '}
				</span>
			);
		}
	};

	const renderWord = (word: ReducedWordData, index: number): JSX.Element => {
		let renderedElement;
		if (word.content === ' ')
		{
			renderedElement = spaceRender(index);
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
			const id = uuid();
			renderedElement = (
				<span
					key={index}
					id={id}
					className={"word-span word-" + word.content.toLowerCase()}
					style={{
						backgroundColor: getStyle(word.status ?? 0),
						borderRadius: ".25rem",
						cursor: "pointer",
					}}
					onClick={
						(): void => {
							const element = document.getElementById(id) as HTMLElement;
							element.style.boxShadow = "0 0 0 2px #00000066";
							setSelectedWord(element);
							
							onWordClick(word.content, onWordUpdateCallback);
						}
					}
				>{word.content}</span>
			);
		}
		return renderedElement;
	}

	if (!words)
	{
		return <Loading />;
	}

	return (
		<div ref={ref}>
			<span className="animation-fixer" style={{ backgroundColor: getStyle(98) }}></span>
			<h1>{textData.title}</h1>
			<h4>Page: {currentPage}</h4>
			<div className="word-container">
				{
					words.map(renderWord)
				}
			</div>
			<div>
				<button
					disabled={currentPage === 1}
					onClick={(): void => {loadPage(textData.id, currentPage-1)}}
				>Previous page</button>
				<button
					onClick={
						async (): Promise<void> => {
							await addWordsInBatch(99, null, null);
							updateTextStatistics();
							if (currentPage < textData.numberOfPages!)
							{
								loadPage(textData.id, currentPage+1);
							}
						}
					}
				>{(currentPage === textData.numberOfPages) ? 'Mark as finished' : 'Next page'}</button>
			</div>
		</div>
	);
};

export { Reader };
