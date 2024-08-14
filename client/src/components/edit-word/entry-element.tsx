/*
 * Irakur - Learn languages through immersion
 * Copyright (C) 2023-2024 Ander Aginaga San Sebastián (a.k.a. Laquin or Laquinh)
 * Licensed under version 3 of the GNU Affero General Public License
 */

import React from 'react';

import { Entry } from '@common/types';

const EntryElement = ({ entry }: { entry: Entry }): JSX.Element => {
	return (
		<React.Fragment>
			<input
				type="text"
				name="reading"
				placeholder="Reading"
				defaultValue={entry.reading}
				onChange={(e) => entry.reading = e.target.value}
				style={{
					width: "60%",
					backgroundColor: "#FFFFFFCC",
					border: "none",
					borderRadius: "0.5rem",
					borderBottom: "1px solid #00000066",
					padding: "0.33rem",
				}}
			/>
			<textarea
				name="meaning"
				placeholder="Meaning"
				defaultValue={entry.meaning}
				onChange={(e) => entry.meaning = e.target.value}
				style={{
					width: "100%",
					backgroundColor: "#FFFFFFCC",
					border: "none",
					borderRadius: "0.5rem",
					borderBottom: "1px solid #00000066",
					padding: "0.33rem",
					height: "3rem",
					fontSize: "1rem",
				}}
			/>
		</React.Fragment>
	);
};

export { EntryElement };
