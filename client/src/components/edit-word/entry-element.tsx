/*
 * Irakur - Learn languages through immersion
 * Copyright (C) 2023-2024 Ander "Laquin" Aginaga San Sebastián
 * Licensed under version 3 of the GNU Affero General Public License
 */

import React from 'react';

import { Entry } from '@common/types';

const EntryElement = ({ entry, deleteEntry }: { entry: Entry, deleteEntry: () => void }): JSX.Element => {
	return (
		<div style={{ marginTop: "0.5rem", marginBottom: "0.5rem" }}>
			<input
				key={entry.meaning}
				type="text"
				name="meaning"
				placeholder="Meaning"
				defaultValue={entry.meaning}
			/>
			<input
				key={entry.reading}
				type="text"
				name="reading"
				placeholder="Reading"
				defaultValue={entry.reading}
			/>
			<button type="button" onClick={deleteEntry}>Delete entry</button>
		</div>
	);
};

export { EntryElement };
