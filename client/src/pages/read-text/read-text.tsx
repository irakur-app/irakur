/*
 * Irakur - Learn languages through immersion
 * Copyright (C) 2023-2024 Ander Aginaga San Sebastián (a.k.a. Laquin or Laquinh)
 * Licensed under version 3 of the GNU Affero General Public License
 */

import { useEffect, useState } from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { Outlet } from 'react-router-dom';

import { Language, Text, Word } from '@common/types'
import { backendConnector } from '../../backend-connector';
import { Dictionary } from '../../components/dictionary';
import { EditWord } from '../../components/edit-word';
import { Loading } from '../../components/loading';
import { Reader } from '../../components/reader';

const ReadText = (): JSX.Element => {
	const [textData, setTextData] = useState<Text | null>(null);
	const [languageData, setLanguageData] = useState<Language | null>(null);
	const [selectedWordContent, setSelectedWordContent] = useState<string | null>(null);
	const [
		selectedWordUpdateCallback,
		setSelectedWordUpdateCallback
	] = useState<(() => (content: string, status: number) => void) | null>(null);

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

	useEffect(
		(): void => {
			const fetchLanguageData = async (languageId: number): Promise<void> => {
				const language = await backendConnector.getLanguage(languageId);
				setLanguageData(language);
			}

			if (textData)
			{
				fetchLanguageData(textData.languageId);
			}
		},
		[textData]
	);
	
	if (!textData || !languageData)
	{
		return <Loading />;
	}

	const updateEditWord = (content: string, onWordUpdate: () => (content: string, status: number) => void): void => {
		setSelectedWordContent(content);
		setSelectedWordUpdateCallback(onWordUpdate);
	};

	return (
		<HelmetProvider>
			<Helmet>
				<title>Irakur - Read { textData.title }</title>
			</Helmet>

			<div style={{ display: 'flex', margin: '2%' }}>
				<div style={{
					flex: 1,
					width: '75%',
					marginRight: '2%',
					fontSize: '1.5em',
					height: '85vh',
					textAlign: 'justify',
					padding: '1%',
					marginTop: '1%',
				}}>
					<Reader
						textData={textData}
						languageData={languageData}
						onWordClick={updateEditWord}
					/>
				</div>
				<div style={{
					position: 'sticky',
					backgroundColor: '#FFFFFFFF',
					border: '2px solid #DDDDDDFF',
					borderRadius: '25px',
					padding: '2%',
					width: '25%',
					display: 'flex',
					flexDirection: 'column',
				}}>
					<div style={{ paddingBottom: '3%' }}>
						<EditWord
							content={selectedWordContent}
							onWordUpdate={selectedWordUpdateCallback || (() => {console.log('no callback');})}
							languageData={languageData}
						/>
					</div>
					<div style={{ width: '100%', height: '100%', maxHeight: '40%' }}>
						<Dictionary languageData={languageData} content={selectedWordContent || ''}/>
					</div>
				</div>
			</div>
			<Outlet />
		</HelmetProvider>
	);
};

export { ReadText };
