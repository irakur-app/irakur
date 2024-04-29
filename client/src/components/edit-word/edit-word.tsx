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
	'2': '#F5CCA9FF',
	'3': '#F5E1A9FF',
	'4': '#F5F3A9FF',
	'5': '#DDFFDDFF',
	'99': '#FFFFFFFF',
	'98': '#FFFFFFFF',
}

const emptyEntry: Entry = {
	meaning: '',
	reading: '',
};

const getStyle = (status: number): string => {
	return statusStyles[status.toString()] || '#FFFFFFFF';
}

const EditWord = (
	{
		content,
		languageId,
		onWordUpdate
	}: {
		content: string | null,
		languageId: number,
		onWordUpdate: (content: string, status: number) => void
	}
): JSX.Element => {
	const [isNewWord, setIsNewWord] = useState<boolean>(content === null);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [notification, setNotification] = useState<string | null>(null);

	const [id, setId] = useState<number | null>(null);
	const [entries, setEntries] = useState<Entry[]>([emptyEntry]);
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
					setEntries((word.entries.length === 0) ? [{...emptyEntry}] : word.entries);
					setStatus(word.status);
				}
				else
				{
					setIsNewWord(true);
					setId(null);
					setNotes(null);
					setEntries([{...emptyEntry}]);
					setStatus(0);
				}
				setIsLoading(false);
			}

			loadWord();
		},
		[content]
	);

	const addEntry = (): void => {
		setEntries([...entries, {...emptyEntry}]);
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

		const entriesToAdd: Entry[] = (entries ?? []).filter(
			(entry: Entry): boolean => entry.meaning !== '' || entry.reading !== ''
		);

		entriesToAdd.forEach(
			(entry: Entry): void => {
				entry.meaning = entry.meaning.trim();
				entry.reading = entry.reading.trim();
			}
		);

		if (isNewWord)
		{
			await backendConnector.addWord(
				languageId,
				content as string,
				newStatus,
				entriesToAdd,
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
				entriesToAdd,
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
				style={{
					backgroundColor: "#FFFFFFCC",
					border: "none",
					borderRadius: "0.5rem",
					borderBottom: "1px solid black",
					fontSize: "1.5rem",
					width: "98.5%",
					textAlign: "center",
					marginBottom: "1rem",
				}}
				readOnly
			/>
			<div style={{
				overflowY: 'scroll',
				maxHeight: '25vh',
				paddingRight: '2.5%',
				marginBottom: "0.5rem",
				width: "100%",
			}}>
				{
					(entries !== null) &&
					entries.map(
						(entry: Entry, index: number) => (
							<div
								key={uuid()}
								style={{
									display: "flex",
									justifyContent: "space-between",
									alignItems: "center",
								}}
							>
								<div style={{ marginTop: "0.2rem", marginBottom: "0.2rem", width: "90%" }}>
									<EntryElement
										key={uuid()}
										entry={entry}
									/>
								</div>
								<button
									type="button"
									onClick={() => deleteEntry(index)}
									style={{
										backgroundColor: "#DD6666CC",
										border: "none",
										borderRadius: "0.25rem",
										width: "5%",
										height: "1.5rem",
										cursor: "pointer",
									}}
								>X</button>
							</div>
						)
					)
				}
				<button
					type="button"
					onClick={addEntry}
					style={{
						width: "100%",
						height: "1.5rem",
						cursor: "pointer",
						backgroundColor: "#BBDD88CC",
						border: "none",
						borderRadius: "0.25rem",
						marginTop: "0.1rem",
					}}
				>
					Add entry
				</button>
			</div>
			<textarea
				name="notes"
				placeholder="Notes"
				value={
					(notes !== null) ? notes : ''
				}
				onChange={e => setNotes(e.target.value)}
				style={{
					width: "97%",
					backgroundColor: "#FFFFFFCC",
					border: "none",
					borderRadius: "0.5rem",
					borderBottom: "1px solid #00000066",
					padding: "0.33rem",
					height: "3rem",
					fontSize: "0.82rem",
				}}
			/>
			<br />
			<div style={{ display: "flex", gap: "1%", height: "3vh", marginTop: "0.5rem", flexWrap: "wrap" }}>
			{
				[1, 2, 3, 4, 5, 99, 98].map(
					(buttonStatus: number) => (
						<button
							key={uuid()}
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

