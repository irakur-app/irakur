/*
 * Irakur - Learn languages through immersion
 * Copyright (C) 2023-2024 Ander "Laquin" Aginaga San Sebastián
 * Licensed under version 3 of the GNU Affero General Public License
 */

import React, { useEffect, useState } from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { Outlet } from 'react-router-dom';

import { ReducedWordData } from '@common/types';
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

const ReadText = (): JSX.Element => {
	const [words, setWords] = useState<ReducedWordData[]|null>(null);

	const textId = Number(document.location.pathname.split('/').pop());

	useEffect(
		(): void => {
			backendConnector.getWords(textId, 1).then(
				(words: ReducedWordData[]): void => {
					setWords(words);
				}
			);
		},
		[]
	);

	if (!words)
	{
		return <Loading />;
	}

	return (
		<HelmetProvider>
			<Helmet>
				<title>Irakur - Read</title>
			</Helmet>

			{
				words.map(
					(word: ReducedWordData, index: number) => {
						let renderedElement;
						if (word.content === '\n')
						{
							renderedElement = (
								<br key={index} />
							)
						}
						else if (word.type === 'punctuation')
						{
							renderedElement = (
								<span key={index}>{word.content}</span>
							)
						}
						else
						{
							renderedElement = (
								<span
									key={index}
									style={{
										backgroundColor: getStyle(word.status??98),
										borderRadius: ".25rem",
									}}
								>{word.content}</span>
							)
						}
						return renderedElement;
					}
				)
			}
			<Outlet />
		</HelmetProvider>
	);
};

export { ReadText };
