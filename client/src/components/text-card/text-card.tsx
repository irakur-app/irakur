/*
 * Irakur - Learn languages through immersion
 * Copyright (C) 2023-2024 Ander "Laquin" Aginaga San Sebastián
 * Licensed under version 3 of the GNU Affero General Public License
 */

import { backendConnector } from '../../backend-connector';
import { Link } from 'react-router-dom';

const TextCard = (props: any): JSX.Element => {
	const handleDelete = async (): Promise<void> => {
		const enteredText: string | null = prompt("Do you really want to delete text '" + props.title + "' (ID: " + props.id + ")?\nType 'DELETE' to confirm.");
		if (enteredText !== "DELETE") {
			alert("Deletion canceled. Incorrect confirmation text.");
			return;
		}

		const wasDeleted: boolean = await backendConnector.deleteText(props.id);
		if (wasDeleted) {
			window.location.reload();
		}
	}

	return (
		<div>
			<p>Title: {props.title}</p>
			<p>ID: {props.id}</p>
			<p>Language: {props.languageId}</p>
			<Link to={`/texts/edit/${props.id}`}>Edit</Link>
			<button onClick={handleDelete}>Delete</button>
		</div>
	)
}

export { TextCard };