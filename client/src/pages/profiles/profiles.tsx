/*
 * Irakur - Learn languages through immersion
 * Copyright (C) 2023-2024 Ander Aginaga San Sebastián (a.k.a. Laquin or Laquinh)
 * Licensed under version 3 of the GNU Affero General Public License
 */

import React, { useEffect, useState } from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';

import { backendConnector } from '../../backend-connector';
import { Loading } from '../../components/loading';

const Profiles = (): JSX.Element => {
	const [profiles, setProfiles] = useState<string[] | null>(null);
	const [activeProfile, setActiveProfile] = useState<string | null>(null);
	const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

	const handleProfileChange = (event: React.ChangeEvent<HTMLSelectElement>): void => {
		if (event.target === null)
		{
			return;
		}

		if (event.target.value === '')
		{
			setActiveProfile(null);
		}
		else
		{
			setActiveProfile(event.target.value);
		}
	};

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
		event.preventDefault();

		setIsSubmitting(true);

		if (event.target === null)
		{
			setIsSubmitting(false);
			return;
		}

		const wasSet: boolean = (await backendConnector.setActiveProfile(activeProfile as string));

		if (wasSet)
		{
			window.location.href = '/home';
		}
		
		setIsSubmitting(false);
	};

	useEffect(
		(): void => {
			backendConnector.getProfiles().then(
				(profiles: string[]): void => {
					setProfiles(profiles);
				}
			);
		},
		[]
	);

	if (!profiles)
	{
		return <Loading />;
	}

	return (
		<HelmetProvider>
			<Helmet>
				<title>Irakur - Profiles</title>
			</Helmet>
			<h1>Irakur - Profiles</h1>
			<form method="post" onSubmit={handleSubmit}>
				<select name="activeProfile" id="activeProfile" onChange={handleProfileChange}>
					<option value="">Select profile</option>
					{
						profiles.map(
							(profiles: string) =>(
								<option key={profiles} value={profiles}>{profiles}</option>
							)
						)
					}
				</select>
				<button type="submit" disabled={isSubmitting || !activeProfile}>Proceed</button>
			</form>
		</HelmetProvider>
	);
};

export { Profiles };
