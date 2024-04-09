/*
 * Irakur - Learn languages through immersion
 * Copyright (C) 2023-2024 Ander "Laquin" Aginaga San Sebastián
 * Licensed under version 3 of the GNU Affero General Public License
 */

import React, { useEffect, useState } from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { Link } from 'react-router-dom';

import { Language } from '@common/types';
import { backendConnector } from '@src/backend-connector';
import { Loading } from '@src/components/loading';

const Home = (): JSX.Element => {
	const [languages, setLanguages] = useState<Language[] | null>(null);

	const handleLanguageChange = (event: React.ChangeEvent<HTMLSelectElement>): void => {
		if (event.target === null)
		{
			return;
		}

		if (event.target.value === '')
		{
			document.cookie = 'activeLanguage=';
		}
		else
		{
			document.cookie = `activeLanguage=${event.target.value}`;
		}
	};

	useEffect(
		(): void => {
			backendConnector.getLanguages().then(
				(languages: Language[]): void => {
					setLanguages(languages);
				}
			);
		},
		[]
	);

	if (!languages)
	{
		return <Loading />;
	}

	return (
		<HelmetProvider>
			<Helmet>
				<title>Irakur - Home</title>
			</Helmet>
			<h1>Irakur - Home</h1>
			<select name="activeLanguage" id="activeLanguage" onChange={handleLanguageChange}>
				<option value="">Select language</option>
				{
					languages.map(
						(language: Language) =>(
							<option key={language.id} value={language.id}>{language.name}</option>
						)
					)
				}
			</select>
			<br />
			<Link to="/languages">Go to languages</Link>
			<br />
			<Link to="/texts">Go to texts</Link>
		</HelmetProvider>
	);
};

export { Home };
