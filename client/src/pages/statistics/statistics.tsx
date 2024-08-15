/*
 * Irakur - Learn languages through immersion
 * Copyright (C) 2023-2024 Ander Aginaga San Sebastián (a.k.a. Laquin or Laquinh)
 * Licensed under version 3 of the GNU Affero General Public License
 */

import React, { useEffect, useState } from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { Link, Outlet } from 'react-router-dom';

import { Text } from '@common/types';
import { backendConnector } from '../../backend-connector';
import { Loading } from '../../components/loading';
import { TextCard } from '../../components/text-card';

const Statistics = (): JSX.Element => {
	const [wordsImprovedCount, setWordsImprovedCount] = useState<number | null>(null);

	let languageId: number | undefined = Number(document.cookie.split("=")[1]);
	languageId = (isNaN(languageId) || languageId === 0) ? undefined : languageId;

	useEffect(
		(): void => {
			if(languageId)
			{
				backendConnector.getWordsImprovedCount(languageId).then(
					(count: number): void => {
						setWordsImprovedCount(count);
					}
				);
			}
		},
		[]
	);

	if (wordsImprovedCount == null)
	{
		return <Loading />;
	}

	return (
		<HelmetProvider>
			<Helmet>
				<title>Irakur - Statistics</title>
			</Helmet>
			<h1>Irakur - Statistics</h1>
			
			In the last 24 hours, you have improved <strong>{wordsImprovedCount}</strong> word(s).

			<Outlet />
		</HelmetProvider>
	);
};

export { Statistics };
