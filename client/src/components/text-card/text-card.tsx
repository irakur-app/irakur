/*
 * Irakur - Learn languages through immersion
 * Copyright (C) 2023-2024 Ander "Laquin" Aginaga San Sebastián
 * Licensed under version 3 of the GNU Affero General Public License
 */

import { Link } from 'react-router-dom';

import { Text } from '@common/types';
import { backendConnector } from '../../backend-connector';

const TextCard = ({ text }: { text: Text }): JSX.Element => {
	const handleDelete = async (): Promise<void> => {
		const enteredText: string | null = prompt(
			"Do you really want to delete text '" + text.title
				+ "' (ID: " + text.id + ")?\n"
				+ "Type 'DELETE' to confirm."
		);
		if (enteredText !== "DELETE")
		{
			alert("Deletion canceled. Incorrect confirmation text.");
			return;
		}

		const wasDeleted: boolean = await backendConnector.deleteText(text.id);
		if (wasDeleted)
		{
			window.location.reload();
		}
	};

	return (
		<div>
			<p>Title: {text.title}</p>
			<p>ID: {text.id}</p>
			<p>Language: {text.languageId}</p>
			<Link to={`/texts/edit/${text.id}`}>Edit</Link>
			&nbsp;&nbsp;&nbsp;&nbsp;
			<Link to={`/texts/read/${text.id}`}>Read</Link>
			&nbsp;&nbsp;&nbsp;&nbsp;
			<button onClick={handleDelete}>Delete</button>
		</div>
	);
};

export { TextCard };
