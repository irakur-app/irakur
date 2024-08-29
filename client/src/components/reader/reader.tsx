/*
 * Irakur - Learn languages through immersion
 * Copyright (C) 2023-2024 Ander Aginaga San Sebastián (a.k.a. Laquin or Laquinh)
 * Licensed under version 3 of the GNU Affero General Public License
 */

import { useEffect, useRef, useState } from 'react';
import { v4 as uuid } from 'uuid';

import { Language, ReducedWordData, Text } from '@common/types';
import { getUnixTime,tokenizeString } from '../../../../common/utils';
import { backendConnector } from '../../backend-connector';
import { Loading } from '../../components/loading';

// https://stackoverflow.com/a/3169849
const clearSelection = (): void => {
	const selection = window.getSelection();
	if (!selection)
	{
		return;
	}
	selection.empty();
	selection.removeAllRanges();

	document.getSelection()?.empty();
}

const getFollowingElements = (element: HTMLElement, numberOfElements: number): HTMLElement[] => {
	let currentElement: HTMLElement | null = element;

	const elements: HTMLElement[] = [];

	for (let i = 0; i < numberOfElements && currentElement !== null; i++)
	{
		elements.push(currentElement);
		currentElement = currentElement.nextElementSibling as HTMLElement | null;
	}

	return elements;
}

const getElementsContent = (elements: HTMLElement[]): string => {
	return elements.map((element: HTMLElement) => element.textContent).join('');
}

const getSelectionElements = (element: HTMLElement, selection: string, alphabet: string): HTMLElement[] => {
	let currentElement: HTMLElement | null = (element.dataset.type === "whitespace")
		? element.nextElementSibling as HTMLElement
		: element;
	
	let cumulativeSelection = currentElement.textContent!;
	const elements: HTMLElement[] = [];

	const selectionOnFollowingWords = tokenizeString(selection, alphabet).slice(1).join('');
	const multiwordBeginning: string = currentElement.textContent! + selectionOnFollowingWords;

	while (currentElement !== null && multiwordBeginning.startsWith(cumulativeSelection))
	{
		elements.push(currentElement);
		currentElement = currentElement.nextElementSibling as HTMLElement | null;
		cumulativeSelection += currentElement?.textContent!;
	}

	const elementContents = getElementsContent(elements);

	if (!elementContents.endsWith(selection))
	{
		elements.push(currentElement!);
	}

	if (elements[0].classList.contains('whitespace'))
	{
		elements.shift();
	}
	if (elements[elements.length - 1].classList.contains('whitespace'))
	{
		elements.pop();
	}

	return elements;
}

const clearNewMultiword = (): void => {
	const newMultiwordElements = document.getElementsByClassName('new-multiword') as HTMLCollectionOf<HTMLElement>;
	if (newMultiwordElements.length > 0)
	{
		const parentElement = newMultiwordElements[0].parentElement;
		if (parentElement !== null)
		{
			while (newMultiwordElements[0].firstChild)
			{
				parentElement.insertBefore(newMultiwordElements[0].firstChild, newMultiwordElements[0]);
			}
			parentElement.removeChild(newMultiwordElements[0]);
		}
	}
};

const convertSpanToNewMultiword = (span: HTMLElement): void => {
	span.className = "new-multiword";
	span.style.borderRadius = ".25rem",
	span.style.cursor = "pointer",
	span.style.boxShadow = "0 0 0 2px #00000066";
};

const convertSpanToSavedMultiword = (span: HTMLElement, status: number): void => {
	span.className = "multiword";
	span.style.borderRadius = ".25rem",
	span.style.cursor = "pointer",
	span.style.backgroundColor = getStyle(status);
	span.style.boxShadow = "0 0 0 2px " + getStyle(status);

	span.setAttribute("data-status", status.toString());
};

const insertMultiword = (
	parentElement: HTMLElement,
	firstElement: HTMLElement,
	elementList: HTMLElement[],
	newParent: HTMLElement
) => {
	const tempSpan = document.createElement('span');
	parentElement.insertBefore(tempSpan, firstElement);
	for (let i = 0; i < elementList.length; i++) {
		newParent.appendChild(elementList[i]);
	}
	parentElement.insertBefore(newParent, tempSpan);
	parentElement.removeChild(tempSpan);
}

const statusStyles: Record<string, string> = {
	'0': '#ADDFF4FF',
	'1': '#F5B8A9FF',
	'2': '#F5CCA9FF',
	'3': '#F5E1A9FF',
	'4': '#F5F3A9FF',
	'5': '#DDFFDDFF',
	'99': '#FFFFFF00',
	'98': '#FFFFFF00',
};

const getStyle = (status: number): string => {
	return statusStyles[status.toString()] || '#FFFFFF00';
};

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
	const [currentPage, setCurrentPage] = useState<number>(
		(textData.progress < 1)
			? (Math.floor(textData.progress * textData.numberOfPages!) + 1)
			: 1
	);
	const [pageToJump, setPageToJump] = useState<number>(currentPage);
	const [words, setWords] = useState<ReducedWordData[]|null>(null);
	const [selectedWord, setSelectedWord] = useState<HTMLElement | null>(null);
	const [firstSelectedWord, setFirstSelectedWord] = useState<HTMLElement | null>(null);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [areButtonsDisabled, setAreButtonsDisabled] = useState<boolean>(false);

	const ref = useRef<HTMLDivElement>(null);

	const updateTextStatistics = async (): Promise<void> => {
		const newProgress = currentPage/textData.numberOfPages!;
		const newTime = getUnixTime();

		const shouldUpdateTimeFinished: boolean = (
			currentPage === textData.numberOfPages! && textData.timeFinished === null
		);

		console.log("shouldUpdateTimeFinished:", shouldUpdateTimeFinished);
		console.log("newProgress:", newProgress);

		await backendConnector.editText(
			textData.id,
			undefined,
			undefined,
			undefined,
			undefined,
			undefined,
			undefined,
			(shouldUpdateTimeFinished) ? newTime : undefined,
			(newProgress > textData.progress) ? newProgress : undefined
		);

		if (shouldUpdateTimeFinished)
		{
			textData.timeFinished = newTime;
		}
		if (newProgress > textData.progress)
		{
			textData.progress = newProgress;
		}
	}

	const loadPage = async (textId: number, pagePosition: number): Promise<void> => {
		setIsLoading(true);
		setWords(null);
		setWords(await backendConnector.getWords(textId, pagePosition));

		await backendConnector.editText(
			textData.id,
			undefined,
			undefined,
			undefined,
			undefined,
			undefined,
			getUnixTime(),
			undefined,
			undefined
		);

		setCurrentPage(pagePosition);

		document.querySelectorAll<HTMLElement>('.word').forEach(
			(element: HTMLElement): void => {
				element.style.transition = "none";
			}
		);

		setIsLoading(false);
		setAreButtonsDisabled(false);
	}

	const addWordsInBatch = async (
		status: number,
		lastIndex: number | null,
		contentException: string | null
	): Promise<void> => {
		setAreButtonsDisabled(true);
		const wordElements = Array.from(document.querySelectorAll<HTMLElement>(`.word[data-index]`));
		
		const wordBank = (lastIndex === null)
			? wordElements
			: wordElements.filter(
				(element: HTMLElement): boolean => {
					return (
						(parseInt(element.dataset.index!)) <= lastIndex
					);
				}
		);

		let newWordContents: string[] = wordBank!.filter(
			(word: HTMLElement): boolean => {
				console.log(word.dataset);
				return (
					(word.dataset.status === null
						|| word.dataset.status === undefined
						|| parseInt(word.dataset.status!) === 0
					)
						&& word.dataset.content !== contentException
						&& word.dataset.type === "word"
				);
			}
		).map(
			(word: HTMLElement): string => {
				return word.dataset.content!.toLowerCase();
			}
		);

		if (newWordContents.length === 0)
		{
			setAreButtonsDisabled(false);
			return;
		}

		newWordContents = [...new Set(newWordContents)];

		await backendConnector.addWordsInBatch(languageData.id, newWordContents, status, getUnixTime()).then(
			(): void => {
				for (const content of newWordContents)
				{
					if (content === '\n')
					{
						continue;
					}
					const wordElements = document.querySelectorAll(
						`[data-content="${content?.toLowerCase()}"]`
					) as NodeListOf<HTMLElement>;
					
					for (let i = 0; i < wordElements.length; i++)
					{
						wordElements[i].dataset.status = status.toString();
						wordElements[i].style.transition = "background-color 2s ease-out";
						wordElements[i].style.backgroundColor = getStyle(status);
					}
				}

				setAreButtonsDisabled(false);
			}
		);
	}

	const onWordUpdate = (index: number, content: string, status: number): void => {
		const wordElements = document.querySelectorAll(
			`[data-content="${content?.toLowerCase()}"]`
		) as NodeListOf<HTMLElement>;
		
		for (let i = 0; i < wordElements.length; i++)
		{
			wordElements[i].style.transition = "background-color 0.3s ease-out";
			wordElements[i].style.backgroundColor = getStyle(status);
			wordElements[i].dataset.status = status.toString();
		}

		addWordsInBatch(99, index, content);
	};

	useEffect(
		(): void => {
			loadPage(textData.id, currentPage);

			// For some reason, the first animation glitches.
			// We force this invisible animation so the subsequent ones work.
			const animationFixers = document.getElementsByClassName('animation-fixer') as HTMLCollectionOf<HTMLElement>;
			if (animationFixers.length > 0)
			{
				animationFixers[0].style.transition = "background-color 0.5s ease-out";
				animationFixers[0].style.backgroundColor = getStyle(99);
			}
		},
		[]
	);

	const handleMouseDown = (event: MouseEvent): void => {
		console.log(".");
		if (selectedWord !== null) {
			selectedWord.style.boxShadow = "none";
		}
		setSelectedWord(null);

		clearNewMultiword();

		setFirstSelectedWord(() => event.target as HTMLElement);
	};

	const handleMouseUp = (event: MouseEvent): void => {
		const selectedText = window.getSelection()!.toString();

		console.log("mouseup");

		const lastSelectedWord = event.target as HTMLElement;

		const rightToLeft = (
			parseInt(lastSelectedWord.getAttribute('data-index')!)
				> parseInt(firstSelectedWord?.getAttribute('data-index')!)
		);
		const firstWordInSelection = (rightToLeft ? firstSelectedWord : lastSelectedWord);
		
		if (
			selectedText.length > 0
				&& firstWordInSelection !== null
				&& !firstWordInSelection.textContent!.includes(selectedText)
		) {
			const selectedElements = getSelectionElements(firstWordInSelection, selectedText.trim(), languageData.alphabet);
			const parentElement = selectedElements[0].parentElement!;

			if (selectedElements.length > 0 && parentElement?.dataset.type !== "multiword") {
				const newSpan = document.createElement('span');
				convertSpanToNewMultiword(newSpan);
				setSelectedWord(newSpan);
				insertMultiword(parentElement, selectedElements[0], selectedElements, newSpan);

				const onMultiwordSaved = () => (content: string, status: number) => {
					const index = parseInt(selectedElements[0].getAttribute('data-index')!);

					const firstElements = document.querySelectorAll(
						`[data-content="${selectedElements[0].textContent!.toLowerCase()}"]`
					) as NodeListOf<HTMLElement>;

					clearNewMultiword();

					for (let i = 0; i < firstElements.length; i++)
					{
						const followingElements = getFollowingElements(firstElements[i], selectedElements.length);
						if (getElementsContent(followingElements) === content)
						{
							const newSpan = document.createElement('span');
							convertSpanToSavedMultiword(newSpan, status);
							setSelectedWord(newSpan);
							insertMultiword(parentElement, firstElements[i], followingElements, newSpan);
						}
					}

					setSelectedWord(null);

					addWordsInBatch(99, index-1, content);
				}
				const elementsContent = getElementsContent(selectedElements);
				onWordClick(elementsContent, onMultiwordSaved);
			}
			else if (selectedElements.length > 0) {
				clearSelection();

				parentElement.style.borderRadius = ".25rem",
				parentElement.style.cursor = "pointer",
				parentElement.style.boxShadow = "0 0 0 2px #00000066";
				setSelectedWord(parentElement);

				const onMultiwordUpdated = () => (content: string, status: number) => {
					const index = parseInt(selectedElements[0].getAttribute('data-index')!);

					const firstElements = document.querySelectorAll(
						`[data-content="${selectedElements[0].textContent!.toLowerCase()}"]`
					) as NodeListOf<HTMLElement>;

					clearNewMultiword();

					for (let i = 0; i < firstElements.length; i++)
					{
						const followingElements = getFollowingElements(firstElements[i], selectedElements.length);
						if (getElementsContent(followingElements) === content)
						{
							const multiword = firstElements[i].parentElement as HTMLElement;
							multiword.style.transition = "background-color 0.3s ease-out";
							multiword.style.backgroundColor = getStyle(status);
							multiword.style.boxShadow = "0 0 0 2px " + getStyle(status);
							multiword.dataset.status = status.toString();
						}
					}

					setSelectedWord(null);

					addWordsInBatch(99, index-1, content);
				}
				const elementsContent = getElementsContent(selectedElements);
				onWordClick(elementsContent, onMultiwordUpdated);
			}
		}
	};

	useEffect(
		(): (() => void) => {
			ref.current?.addEventListener('mousedown', handleMouseDown);
			ref.current?.addEventListener('mouseup', handleMouseUp);

			return (): void => {				
				ref.current?.removeEventListener('mousedown', handleMouseDown);
				ref.current?.removeEventListener('mouseup', handleMouseUp);
			};
		}
	);

	//const spaceStyle: React.CSSProperties = { fontSize: (shouldShowSpaces ? undefined : 0) };
	const spaceRender = (index: number): JSX.Element  =>
	{
		if (languageData.shouldShowSpaces)
		{
			return (
				<span
					className="whitespace"
					data-index={index}
					data-type="whitespace"
					key={index}
				>{' '}</span>
			);
		}
		else
		{
			return (
				<span
					className="whitespace"
					data-index={index}
					data-content=" "
					data-type="whitespace"
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

	const renderWord = (word: ReducedWordData): JSX.Element => {
		let renderedElement;
		if (word.content === ' ')
		{
			renderedElement = spaceRender(word.index);
		}
		else if (word.content === '\n')
		{
			renderedElement = <br key={word.index} data-index={word.index} style={{ marginBottom: "1rem" }}/>;
		}
		else if (word.type === 'punctuation')
		{
			renderedElement = (
				<span
					key={word.index} 
					data-content={word.content.toLowerCase()}
					data-index={word.index}
				>{word.content}</span>
			);
		}
		else if (word.type === 'multiword')
		{
			const tokensInside: JSX.Element[] = word.tokens!.map(renderWord);
			const id = uuid();
			renderedElement = (
				<span
					key={word.index}
					id={id}
					className="multiword"
					data-index={word.index}
					data-status={word.status}
					data-type={word.type}
					style={{
						backgroundColor: getStyle(word.status ?? 0),
						borderRadius: ".25rem",
						cursor: "pointer",
						boxShadow: "0 0 0 2px " + getStyle(word.status ?? 0),
					}}
				>{tokensInside}</span>
			);
		}
		else
		{
			const onWordUpdateCallback = () => (content: string, status: number) => {
				onWordUpdate(word.index, content, status);
			}
			const id = uuid();
			renderedElement = (
				<span
					key={word.index}
					id={id}
					className="word"
					data-content={word.content.toLowerCase()}
					data-index={word.index}
					data-status={word.status}
					data-type={word.type}
					style={{
						backgroundColor: getStyle(word.status ?? 0),
						borderRadius: ".25rem",
						cursor: "pointer",
					}}
					onClick={
						(event: React.MouseEvent<HTMLElement>): void => {
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

	if (!words || isLoading)
	{
		return <Loading />;
	}

	return (
		<div ref={ref}>
			<span className="animation-fixer" style={{ backgroundColor: getStyle(98) }}></span>
			<h1>{textData.title}</h1>
			<h4>Page: {currentPage}</h4>
			<div className="word-container" style={{ height: '60vh', overflowY: 'auto' }}>
				{
					words.map(renderWord)
				}
			</div>
			<div
				className="buttons-container"
				style={{
					position: "sticky",
					bottom: "0",
				}}
			>
				<button
					disabled={currentPage === 1 || areButtonsDisabled}
					onClick={(): void => {loadPage(textData.id, currentPage-1)}}
				>Previous page</button>
				<button
					disabled={areButtonsDisabled}
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
				{/*number input*/}
				<input
					type="number"
					min={1}
					max={textData.numberOfPages!}
					value={pageToJump}
					onChange={(e: React.ChangeEvent<HTMLInputElement>): void => {
						setPageToJump(Number(e.target.value));
					}}
				/>
				<button
					disabled={areButtonsDisabled}
					onClick={
						(): void => {
							if (pageToJump >= 1 && pageToJump <= textData.numberOfPages!)
							{
								loadPage(textData.id, pageToJump);
							}
						}
					}
				>Jump to page</button>
			</div>
		</div>
	);
};

export { Reader };

