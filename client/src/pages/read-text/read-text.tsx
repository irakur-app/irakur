/*
 * Irakur - Learn languages through immersion
 * Copyright (C) 2023-2024 Ander "Laquin" Aginaga San Sebastián
 * Licensed under version 3 of the GNU Affero General Public License
 */

import { Helmet, HelmetProvider } from 'react-helmet-async';
import { Outlet } from 'react-router-dom';

import { Reader } from '../../components/reader';

const ReadText = (): JSX.Element => {
	return (
		<HelmetProvider>
			<Helmet>
				<title>Irakur - Read</title>
			</Helmet>

			<Reader />
			<Outlet />
		</HelmetProvider>
	);
};

export { ReadText };
