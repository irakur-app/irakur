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
						else
						{
							renderedElement = (
								<span key={index}>{word.content}</span>
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
