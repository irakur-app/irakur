/*
 * Irakur - Learn languages through immersion
 * Copyright (C) 2023-2024 Ander "Laquin" Aginaga San Sebastián
 * Licensed under version 3 of the GNU Affero General Public License
 */

import { backendConnector } from '../../backend-connector';
import { Link } from 'react-router-dom';

const LanguageCard = (props: any) => {
	const handleDelete = async () => {
		const enteredText = prompt("Do you really want to delete language '" + props.name + "' (ID: " + props.id + ")?\n*It will permanently delete all texts and all words associated with it*.\nType 'DELETE' to confirm.");
		if (enteredText !== "DELETE") {
			alert("Deletion canceled. Incorrect confirmation text.");
			return;
		}

		const wasDeleted = await backendConnector.deleteLanguage(props.id);
		if (wasDeleted) {
			window.location.reload();
		}
	}

	return (
		<div>
			<p>Name: {props.name}</p>
			<p>ID: {props.id}</p>
			<Link to={`/languages/edit/${props.id}`}>Edit</Link>
			<button onClick={handleDelete}>Delete</button>
		</div>
	)
}

export { LanguageCard };