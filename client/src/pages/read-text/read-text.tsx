/*
 * Irakur - Learn languages through immersion
 * Copyright (C) 2023-2024 Ander "Laquin" Aginaga San Sebastián
 * Licensed under version 3 of the GNU Affero General Public License
 */

import { Helmet, HelmetProvider } from 'react-helmet-async';
import { Outlet } from 'react-router-dom';

import { EditWord } from '../../components/edit-word';
import { Reader } from '../../components/reader';

const ReadText = (): JSX.Element => {
	return (
		<HelmetProvider>
			<Helmet>
				<title>Irakur - Read</title>
			</Helmet>

			<div style={{ display: 'flex', margin: '5%' }}>
				<div style={{
					flex: 1,
					width: '80%',
					marginRight: '5%',
					fontSize: '1.5em',
					overflowY: 'scroll',
					height: '80vh',
					textAlign: 'justify',
					paddingRight: '1%',
				}}>
					<Reader />
				</div>
				<div style={{
					position: 'sticky',
					backgroundColor: '#00000011',
					borderRadius: '25px',
					padding: '2%',
					width: '20%',
				}}>
					<EditWord />
				</div>
			</div>
			<Outlet />
		</HelmetProvider>
	);
};

export { ReadText };
