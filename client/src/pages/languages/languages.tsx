/* 
 * Irakur - Learn languages through immersion
 * Copyright (C) 2023-2024 Ander "Laquin" Aginaga San Sebastián
 * Licensed under version 3 of the GNU Affero General Public License
 */

import React, { useState, useEffect } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { backendConnector } from '../../backend-connector';
import { Loading } from '../../components/loading';
import { LanguageCard } from '../../components/language-card';

const Languages = () => {
	const [languages, setLanguages] = useState<any | null>(null);

	useEffect(() => {
		backendConnector.getLanguages().then((data) => {
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
			languages.map((language: any) =>(
			<React.Fragment key={language.id}>
				<LanguageCard name={language.name} id={language.id} />
				<br />
			</React.Fragment>
			))
			}
		</HelmetProvider>
	);
};

export { Languages };