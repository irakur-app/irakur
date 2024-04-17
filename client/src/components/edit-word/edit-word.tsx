/*
 * Irakur - Learn languages through immersion
 * Copyright (C) 2023-2024 Ander "Laquin" Aginaga San Sebastián
 * Licensed under version 3 of the GNU Affero General Public License
 */

import { useEffect, useState } from 'react';

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

const EditWord = ({ content, languageId }: { content: string | null, languageId: number }): JSX.Element => {
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [entries, setEntries] = useState<Entry[] | null>(null);
	const [notes, setNotes] = useState<string | null>(null);

	useEffect(
		(): void => {
			const loadWord = async (): Promise<void> => {
				setIsLoading(true);
				if (content === null)
				{
					return;
				}
				const word = await backendConnector.findWord(content, languageId);
				if (word)
				{
					setNotes(word.notes);
					setEntries(word.entries);
				}
				else
				{
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
		const emptyEntry: Entry = {
			meaning: '',
			reading: '',
		}

		if (entries === null)
		{
			setEntries([emptyEntry]);
		}
		else
		{
			setEntries([...entries, emptyEntry]);
		}
	}

	const deleteEntry = (index: number): void => {
		if (entries !== null)
		{
			const newEntries = [...entries];
			console.log(newEntries);
			newEntries.splice(index, 1);
			console.log(newEntries);
			setEntries(newEntries);
		}
	}

	if (isLoading)
	{
		return <Loading />;
	}

	return (
		<form>
			<input
				type="text"
				name="content"
				placeholder="Word content"
				value={
					(content !== null) ? content : ''
				}
				readOnly
			/>
			<br />
			{
				(entries !== null) &&
				entries.map(
					(entry: Entry, index: number) => {
						console.log(entry.meaning);
						return (
						<EntryElement
							key={index}
							entry={entry}
							deleteEntry={() => deleteEntry(index)}
						/>
					);
					}
				)
			}
			<button type="button" onClick={addEntry}>Add entry</button>
			<br />
			<input
				type="text"
				name="notes"
				placeholder="Notes"
				defaultValue={
					(notes !== null) ? notes : ''
				}
			/>
			<br />
			<input type="submit" value="1" />
			<input type="submit" value="2" />
			<input type="submit" value="3" />
			<input type="submit" value="4" />
			<input type="submit" value="5" />
			<input type="submit" value="99" />
			<input type="submit" value="98" />
		</form>
	);
};

export { EditWord };

