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

const statusStyles: Record<string, string> = {
	'0': '#ADDFF4FF',
	'1': '#F5B8A9FF',
	'2': '#F5CCA9E5',
	'3': '#F5E1A9BF',
	'4': '#F5F3A99F',
	'5': '#DDFFDD7F',
	'99': '#FFFFFF00',
	'98': '#FFFFFF00',
}

const getStyle = (status: number): string => {
	return statusStyles[status.toString()] || '#FFFFFF00';
}

const EditWord = ({ content, languageId, onWordUpdate }: { content: string | null, languageId: number, onWordUpdate: (content: string, status: number) => void }): JSX.Element => {
	const [isNewWord, setIsNewWord] = useState<boolean>(content === null);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [notification, setNotification] = useState<string | null>(null);

	const [id, setId] = useState<number | null>(null);
	const [entries, setEntries] = useState<Entry[] | null>(null);
	const [notes, setNotes] = useState<string | null>(null);

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
				}
				else
				{
					setIsNewWord(true);
					setId(null);
					setNotes(null);
					setEntries(null);
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
		
		const status: number = parseInt((e.nativeEvent.submitter as HTMLButtonElement).value);
		
		if (isNewWord)
		{
			await backendConnector.addWord(
				languageId,
				content as string,
				status,
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
				status,
				entries ?? [],
				notes ?? '',
				new Date().toISOString()
			);
		}

		setNotification('Word ' + (isNewWord ? 'added' : 'updated'));

		onWordUpdate(content!, status);
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
			<input type="submit" value="1" />
			<input type="submit" value="2" />
			<input type="submit" value="3" />
			<input type="submit" value="4" />
			<input type="submit" value="5" />
			<input type="submit" value="99" />
			<input type="submit" value="98" />
			{notification && <p>{notification}</p>}
		</form>
	);
};

export { EditWord };

