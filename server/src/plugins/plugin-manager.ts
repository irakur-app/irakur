/*
 * Irakur - Learn languages through immersion
 * Copyright (C) 2023-2024 Ander Aginaga San Sebastián (a.k.a. Laquin or Laquinh)
 * Licensed under version 3 of the GNU Affero General Public License
 */

import { IrakurApi, Plugin, TextProcessor, WordDataProvider } from './plugin-api';
import { sandboxProxy } from './sandbox-proxy';

class PluginManager
{
	private static instance: PluginManager;

	private plugins: Plugin[] = [];
	private textProcessors: TextProcessor[] = [];
	private wordDataProviders: WordDataProvider[] = [];

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
				registerTextProcessor: (textProcessor: TextProcessor) => {
					this.textProcessors.push(textProcessor);
					console.log('Registered text processor: ' + textProcessor.name);
				},
				registerWordDataProvider: (wordDataProvider: WordDataProvider) => {
					this.wordDataProviders.push(wordDataProvider);
					console.log('Registered word data retriever: ' + wordDataProvider.name);
				},
			},
		};

		const irakur = sandboxProxy(this.api);
		global.irakur = irakur;

		PluginManager.instance = this;
	}

	async startPlugins(): Promise<void>
	{
		for (const plugin of this.plugins)
		{
			await plugin.start?.(this.api);
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
	
	async processText(text: string): Promise<string>
	{
		for (const textProcessor of this.textProcessors)
		{
			text = await textProcessor.processText(text);
		}
		console.log(text);
		return text;
	}
}

const pluginManager: PluginManager = new PluginManager();

export { pluginManager };
