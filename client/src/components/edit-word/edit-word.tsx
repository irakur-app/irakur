/*
 * Irakur - Learn languages through immersion
 * Copyright (C) 2023-2024 Ander "Laquin" Aginaga San Sebastián
 * Licensed under version 3 of the GNU Affero General Public License
 */

import React, { useEffect, useState } from 'react';
import { v4 as uuid } from 'uuid';

import { Entry } from '@common/types';
import { backendConnector } from '../../backend-connector';
import { Loading } from '../loading';
import { EntryElement } from './entry-element';

const statusNames: Record<string, string> = {
	'0': 'New',
	'1': '1',
	'2': '2',
	'3': '3',
	'4': '4',
	'5': '5',
	'99': 'Known',
	'98': 'Ignore',
}

const statusStyles: Record<string, string> = {
	'0': '#ADDFF4FF',
	'1': '#F5B8A9FF',
	'2': '#F5CCA9E5',
	'3': '#F5E1A9BF',
	'4': '#F5F3A99F',
	'5': '#DDFFDD7F',
	'99': '#FFFFFFFF',
	'98': '#FFFFFFFF',
}

const getStyle = (status: number): string => {
	return statusStyles[status.toString()] || '#FFFFFFFF';
}

const EditWord = ({ content, languageId, onWordUpdate }: { content: string | null, languageId: number, onWordUpdate: (content: string, status: number) => void }): JSX.Element => {
	const [isNewWord, setIsNewWord] = useState<boolean>(content === null);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [notification, setNotification] = useState<string | null>(null);

	const [id, setId] = useState<number | null>(null);
	const [entries, setEntries] = useState<Entry[] | null>(null);
	const [notes, setNotes] = useState<string | null>(null);
	const [status, setStatus] = useState<number>(0);

	useEffect(
		(): void => {
			const loadWord = async (): Promise<void> => {
				setIsLoading(true);
				setNotification(null);
				if (content === null)
				{
					return;
				}
				const word = await backendConnector.findWord(content, languageId);
				if (word)
				{
					setIsNewWord(false);
					setId(word.id);
					setNotes(word.notes);
					setEntries(word.entries);
					setStatus(word.status);
				}
				else
				{
					setIsNewWord(true);
					setId(null);
					setNotes(null);
					setEntries(null);
					setStatus(0);
				}
				setIsLoading(false);
			}

			loadWord();
		},
		[content]
	);

	const addEntry = (): void => {
		const emptyEntry = {
			meaning: '',
			reading: '',
		};
		if (entries === null)
		{
			setEntries([emptyEntry]);
		}
		else
		{
			setEntries([...entries, emptyEntry]);
		}
	};

	const deleteEntry = (index: number): void => {
		if (entries !== null)
		{
			const newEntries = [...entries];
			console.log(newEntries);
			newEntries.splice(index, 1);
			console.log(newEntries);
			setEntries(newEntries);
		}
	};

	const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement, SubmitEvent>): Promise<void> => {
		e.preventDefault();
		
		const newStatus: number = parseInt((e.nativeEvent.submitter as HTMLButtonElement).value);
		
		if (isNewWord)
		{
			await backendConnector.addWord(
				languageId,
				content as string,
				newStatus,
				entries ?? [],
				notes ?? '',
				new Date().toISOString(),
				new Date().toISOString()
			);
		}
		else
		{
			await backendConnector.editWord(
				id as number,
				newStatus,
				entries ?? [],
				notes ?? '',
				new Date().toISOString()
			);
		}

		setNotification('Word ' + (isNewWord ? 'added' : 'updated'));

		setIsNewWord(false);
		setStatus(newStatus);

		onWordUpdate(content!, newStatus);
	};

	if (isLoading)
	{
		return <Loading />;
	}

	return (
		<form onSubmit={handleSubmit}>
			<input
				type="text"
				name="content"
				placeholder="Word content"
				value={
					(content !== null) ? content : ''
				}
				readOnly
			/>
			{
				(entries !== null) &&
				entries.map(
					(entry: Entry, index: number) => (
						<React.Fragment>
							<EntryElement
								key={uuid()}
								entry={entry}
							/>
							<button type="button" onClick={() => deleteEntry(index)}>Delete entry</button>
						</React.Fragment>
					)
				)
			}
			<button type="button" onClick={addEntry}>
				Add entry
			</button>
			<input
				type="text"
				name="notes"
				placeholder="Notes"
				value={
					(notes !== null) ? notes : ''
				}
				onChange={e => setNotes(e.target.value)}
			/>
			<br />
			<div style={{ display: "flex", gap: "1%", height: "3vh", marginTop: "1rem", flexWrap: "wrap" }}>
			{
				[1, 2, 3, 4, 5, 99, 98].map(
					(buttonStatus: number) => (
						<button
							type="submit"
							value={buttonStatus.toString()}
							style={{
								border: (buttonStatus === status) ? "1px solid #00000066" : "1px solid transparent",
								borderRadius: "0.25rem",
								flex: 1,
								backgroundColor: getStyle(buttonStatus),
								cursor: "pointer",
							}}
						>{statusNames[buttonStatus]}</button>
					)
				)
			}
			</div>
			{notification && <p>{notification}</p>}
		</form>
	);
};

export { EditWord };

