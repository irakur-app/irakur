/* 
 * Irakur - Learn languages through immersion
 * Copyright (C) 2023-2024 Ander "Laquin" Aginaga San Sebastián
 * Licensed under version 3 of the GNU Affero General Public License
 */

import { Language } from '@common/types';

import React, { useState, useEffect } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { backendConnector } from '../../backend-connector';
import { Loading } from '../../components/loading';
import { LanguageCard } from '../../components/language-card';

const Languages = (): JSX.Element => {
	const [languages, setLanguages] = useState<Language[] | null>(null);

	useEffect((): void => {
		backendConnector.getLanguages().then((data: Language[]): void => {
			setLanguages(data);
		})
	}, []);

	if (!languages) {
		return <Loading />;
	}

	return (
		<HelmetProvider>
			<Helmet>
				<title>Irakur - Languages</title>
			</Helmet>
			<h1>Irakur - Languages</h1>
			<Link to="/languages/add">Add language</Link>
			{
			languages.map((language: Language) =>(
			<React.Fragment key={language.id}>
				<LanguageCard language = {language} />
				<br />
			</React.Fragment>
			))
			}
		</HelmetProvider>
	);
};

export { Languages };