/*
 * Irakur - Learn languages through immersion
 * Copyright (C) 2023-2024 Ander Aginaga San Sebastián (a.k.a. Laquin or Laquinh)
 * Licensed under version 3 of the GNU Affero General Public License
 */

interface Plugin
{
	name: string;
	start?: () => Promise<void>;
};

interface IrakurApi
{
	plugins: {
		register: (plugin: Plugin) => void;
	};
};

export { Plugin, IrakurApi };