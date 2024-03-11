/* 
 * Irakur - Learn languages through immersion
 * Copyright (C) 2023-2024 Ander "Laquin" Aginaga San Sebastián
 * Licensed under version 3 of the GNU Affero General Public License
 */

import { Link } from 'react-router-dom';
import { Helmet, HelmetProvider } from 'react-helmet-async';

const Home = () => {
	return (
		<HelmetProvider>
			<Helmet>
				<title>Irakur - Home</title>
			</Helmet>
			<h1>Irakur - Home</h1>
			<Link to="/languages">Go to languages</Link>
			<br />
			<Link to="/texts">Go to texts</Link>
		</HelmetProvider>
	);
};

export { Home };