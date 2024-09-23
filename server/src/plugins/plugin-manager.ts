/*
 * Irakur - Learn languages through immersion
 * Copyright (C) 2023-2024 Ander Aginaga San Sebastián (a.k.a. Laquin or Laquinh)
 * Licensed under version 3 of the GNU Affero General Public License
 */

import { AsyncLocalStorage } from 'async_hooks';

import { Language, TextProcessorReference } from '@common/types';
import { IrakurApi, Plugin, TextProcessor, WordDataProvider } from './plugin-api';
import { sandboxProxy } from './sandbox-proxy';

type PluginIdReference = {
	pluginId: string;
};

class PluginManager
{
	private static instance: PluginManager;

	private plugins: Plugin[] = [];
	private textProcessors: (TextProcessor & PluginIdReference)[] = [];
	private wordDataProviders: (WordDataProvider & PluginIdReference)[] = [];

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
					console.log('Registered plugin: ' + plugin.name + ' (' + plugin.id + ')');
				},
				registerTextProcessor: (textProcessor: TextProcessor) => {
					const pluginId = this.asyncLocalStorage.getStore();

					if (!pluginId)
					{
						throw new Error('No plugin id found');
					}

					const textProcessorWithPluginId: TextProcessor & PluginIdReference = {
						...textProcessor,
						pluginId: pluginId,
					}
					
					this.textProcessors.push(textProcessorWithPluginId);
					console.log(
						'Registered text processor: '
						+ textProcessor.name
						+ ' (' + pluginId + '/' + textProcessor.id + ')'
					);
				},
				registerWordDataProvider: (wordDataProvider: WordDataProvider) => {
					const pluginId = this.asyncLocalStorage.getStore();

					if (!pluginId)
					{
						throw new Error('No plugin id found');
					}

					const wordDataProviderWithPluginId: WordDataProvider & PluginIdReference = {
						...wordDataProvider,
						pluginId: pluginId,
					}
					
					this.wordDataProviders.push(wordDataProviderWithPluginId);
					console.log(
						'Registered word data provider: '
							+ wordDataProvider.name
							+ ' (' + pluginId + '/' + wordDataProvider.id + ')'
					);
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
				plugin.id,
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

	async getAllAvailableProcessors(): Promise<(TextProcessor & PluginIdReference)[]>
	{
		console.log(this.textProcessors);
		return this.textProcessors;
	}

	async getSuggestedTextProcessorsForLanguage(language: Language): Promise<TextProcessor[]>
	{
		return this.textProcessors.filter(
			(textProcessor: TextProcessor) => {
				if (Array.isArray(textProcessor.languages))
				{
					return textProcessor.languages.includes(language.templateCode.split(':')[0]);
				}
				
				return textProcessor.languages === this.api.symbols.anyLanguage;
			}
		);
	}
	
	async processText(text: string, textProcessors: TextProcessor[]): Promise<string>
	{
		for (const textProcessor of textProcessors)
		{
			text = await textProcessor.processText(text);
		}
		return text;
	}

	async getActualTextProcessorsForLanguage(language: Language): Promise<(TextProcessor & PluginIdReference)[]> 
	{
		const textProcessorReferences: TextProcessorReference[] = JSON.parse(language.textProcessors).map(
			(textProcessorFullId: string) => {
				return {
					pluginId: textProcessorFullId.split('/')[0],
					textProcessorId: textProcessorFullId.split('/')[1]
				};
			}
		);
	
		const textProcessors = textProcessorReferences.map(
			reference => this.textProcessors.find(
				(textProcessor: (TextProcessor & PluginIdReference)) => 
					textProcessor.pluginId === reference.pluginId
						&& textProcessor.id === reference.textProcessorId
			)
		);

		return textProcessors.filter(
			(textProcessor: (TextProcessor & PluginIdReference) | undefined) => textProcessor !== undefined
		) as (TextProcessor & PluginIdReference)[]; // For some reason it doesn't work without the cast
	}

	async processTextInLanguage(text: string, language: Language): Promise<string>
	{
		const textProcessors = await this.getActualTextProcessorsForLanguage(language);

		return this.processText(text, textProcessors);
	}
}

const pluginManager: PluginManager = new PluginManager();

export { pluginManager };
