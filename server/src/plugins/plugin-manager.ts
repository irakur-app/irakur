/*
 * Irakur - Learn languages through immersion
 * Copyright (C) 2023-2024 Ander Aginaga San Sebastián (a.k.a. Laquin or Laquinh)
 * Licensed under version 3 of the GNU Affero General Public License
 */

import { AsyncLocalStorage } from 'async_hooks';
import { IrakurApi, Plugin, TextProcessor, WordDataProvider } from './plugin-api';
import { sandboxProxy } from './sandbox-proxy';

type PluginNameReference = {
	pluginName: string;
};

class PluginManager
{
	private static instance: PluginManager;

	private plugins: Plugin[] = [];
	private textProcessors: (TextProcessor & PluginNameReference)[] = [];
	private wordDataProviders: (WordDataProvider & PluginNameReference)[] = [];

	public api: IrakurApi;

	private asyncLocalStorage = new AsyncLocalStorage<string>();

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
					const pluginName = this.asyncLocalStorage.getStore();

					if (!pluginName)
					{
						throw new Error('No plugin name found');
					}

					const textProcessorWithPluginName: TextProcessor & PluginNameReference = {
						...textProcessor,
						pluginName: pluginName,
					}
					
					this.textProcessors.push(textProcessorWithPluginName);
					console.log('Registered text processor: ' + textProcessor.name);
				},
				registerWordDataProvider: (wordDataProvider: WordDataProvider) => {
					const pluginName = this.asyncLocalStorage.getStore();

					if (!pluginName)
					{
						throw new Error('No plugin name found');
					}

					const wordDataProviderWithPluginName: WordDataProvider & PluginNameReference = {
						...wordDataProvider,
						pluginName: pluginName,
					}
					
					this.wordDataProviders.push(wordDataProviderWithPluginName);
					console.log('Registered word data provider: ' + wordDataProvider.name);
				},
			},
			symbols: {
				anyLanguage: Symbol('anyLanguage'),
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
			await this.asyncLocalStorage.run(
				plugin.name,
				async () => {
					await plugin.start?.();
				}
			);
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
	
	async processText(text: string, textProcessors: TextProcessor[]): Promise<string>
	{
		for (const textProcessor of textProcessors)
		{
			text = await textProcessor.processText(text);
		}
		console.log(text);
		return text;
	}

	async processTextInLanguage(text: string, language: string): Promise<string>
	{
		const textProcessors = this.textProcessors.filter(
			(textProcessor) => {
				if (Array.isArray(textProcessor.languages))
				{
					return textProcessor.languages.includes(language);
				}
				
				return textProcessor.languages === this.api.symbols.anyLanguage;
			}
		);
		return this.processText(text, textProcessors);
	}
}

const pluginManager: PluginManager = new PluginManager();

export { pluginManager };
