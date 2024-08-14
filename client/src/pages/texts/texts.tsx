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

const Texts = (): JSX.Element => {
	const [texts, setTexts] = useState<Text[] | null>(null);

	let languageId: number | undefined = Number(document.cookie.split("=")[1]);
	languageId = (isNaN(languageId) || languageId === 0) ? undefined : languageId;

	useEffect(
		(): void => {
			backendConnector.getTexts(languageId).then(
				(texts: Text[]): void => {
					setTexts(texts);
				}
			);
		},
		[]
	);

	if (!texts)
	{
		return <Loading />;
	}

	// Render your React components using the fetched data
	return (
		<HelmetProvider>
			<Helmet>
				<title>Irakur - Texts</title>
			</Helmet>
			<h1>Irakur - Texts</h1>
			<Link to="/texts/add">Add text</Link>
			{
				texts.map(
					(text: Text) => (
						<React.Fragment key={text.id}>
							<TextCard text={text} />
							<br />
						</React.Fragment>
					)
				)
			}

			<Outlet />
		</HelmetProvider>
	);
};

export { Texts };
