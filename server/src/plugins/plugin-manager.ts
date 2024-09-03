/*
 * Irakur - Learn languages through immersion
 * Copyright (C) 2023-2024 Ander Aginaga San Sebastián (a.k.a. Laquin or Laquinh)
 * Licensed under version 3 of the GNU Affero General Public License
 */

import { IrakurApi, Plugin } from './plugin-api';

class PluginManager
{
	private static instance: PluginManager;

	private plugins: Plugin[] = [];

	public api: IrakurApi;

	constructor()
	{
		if (PluginManager.instance)
		{
			this.api = PluginManager.instance.api;
			return PluginManager.instance;
		}

		this.api = {
			plugins: {
				register: (plugin: Plugin) => {
					this.plugins.push(plugin);
					console.log('Registered plugin: ' + plugin.name);
				},
			},
		};

		PluginManager.instance = this;
	}

	startPlugins(): void
	{
		for (const plugin of this.plugins)
		{
			plugin.start?.();
		}
	}

	async loadPlugins(pluginPaths: string[]): Promise<void>
	{
		for (const pluginPath of pluginPaths)
		{
			try
			{
				const pluginModule = await import(pluginPath);
				pluginModule.default(this.api);
			}
			catch (error)
			{
				console.error(error);
			}
		}
	}
}

const pluginManager: PluginManager = new PluginManager();

export { pluginManager };
