/*
 * Irakur - Learn languages through immersion
 * Copyright (C) 2023-2024 Ander "Laquin" Aginaga San Sebastián
 * Licensed under version 3 of the GNU Affero General Public License
 */

import { useEffect, useState } from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { Outlet } from 'react-router-dom';

import { Text, Word } from '@common/types'
import { backendConnector } from '../../backend-connector';
import { EditWord } from '../../components/edit-word';
import { Loading } from '../../components/loading';
import { Reader } from '../../components/reader';

const ReadText = (): JSX.Element => {
	const [textData, setTextData] = useState<Text | null>(null);
	const [selectedWordContent, setSelectedWordContent] = useState<string | null>(null);

	useEffect(
		(): void => {
			const fetchTextData = async (): Promise<void> => {
				const textId = Number(document.location.pathname.split('/').pop());
				const text = await backendConnector.getText(textId);
				setTextData(text);
			}

			fetchTextData();
		},
		[]
	);
	
	if (!textData)
	{
		return <Loading />;
	}

	const updateEditWord = (content: string): void => {
		setSelectedWordContent(content);
	};

	return (
		<HelmetProvider>
			<Helmet>
				<title>Irakur - Read { textData.title }</title>
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
					<Reader languageId={textData.languageId} onWordClick={updateEditWord}/>
				</div>
				<div style={{
					position: 'sticky',
					backgroundColor: '#00000011',
					borderRadius: '25px',
					padding: '2%',
					width: '20%',
				}}>
					<EditWord content={selectedWordContent} languageId={textData.languageId}/>
				</div>
			</div>
			<Outlet />
		</HelmetProvider>
	);
};

export { ReadText };
