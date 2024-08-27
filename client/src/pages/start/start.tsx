/*
 * Irakur - Learn languages through immersion
 * Copyright (C) 2023-2024 Ander Aginaga San Sebastián (a.k.a. Laquin or Laquinh)
 * Licensed under version 3 of the GNU Affero General Public License
 */

import { useEffect } from 'react';

import { backendConnector } from '../../backend-connector';
import { Loading } from '../../components/loading';

const Start = (): JSX.Element => {
	useEffect(
		(): void => {
			backendConnector.getActiveProfile().then(
				(profileName: string | null): void => {
					if (profileName === null)
					{
						window.location.href = '/profiles'
					}
					else
					{
						window.location.href = '/home'
					}
				}
			);
		},
		[]
	);

	return <Loading />;
};

export { Start };
