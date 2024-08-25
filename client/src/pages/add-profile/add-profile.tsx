/*
 * Irakur - Learn languages through immersion
 * Copyright (C) 2023-2024 Ander Aginaga San Sebastián (a.k.a. Laquin or Laquinh)
 * Licensed under version 3 of the GNU Affero General Public License
 */

import React, { useState } from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';

import { backendConnector } from '../../backend-connector';

const AddProfile = (): JSX.Element => {
	const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
		event.preventDefault();

		setIsSubmitting(true);

		if (event.target === null)
		{
			return;
		}

		const form = new FormData(event.target as HTMLFormElement);

		const wasAdded: boolean = await backendConnector.addProfile(
			form.get('name') as string
		);

		if (wasAdded)
		{
			window.location.href = '/profiles';
		}

		setIsSubmitting(false);
	};

	return (
		<HelmetProvider>
			<Helmet>
				<title>Irakur - Add profile</title>
			</Helmet>
			<h1>Irakur - Add profile</h1>
			<form method="post" onSubmit={handleSubmit}>
				<label htmlFor="name">Name</label>
				<input type="text" name="name" id="name" />
				<br />

				<button type="submit" disabled={isSubmitting}>Add</button>
			</form>
		</HelmetProvider>
	);
};

export { AddProfile };
