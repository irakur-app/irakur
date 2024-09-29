/*
 * Irakur - Learn languages through immersion
 * Copyright (C) 2023-2024 Ander Aginaga San Sebastián (a.k.a. Laquin or Laquinh)
 * Licensed under version 3 of the GNU Affero General Public License
 */

import { AsyncLocalStorage } from 'async_hooks';

import { Language, TextProcessorReference, WordDataProviderReference } from '@common/types';
import { IrakurApi, Plugin, TextProcessor, WordDataProvider, DictionaryWordData } from './plugin-api';
import { sandboxProxy } from './sandbox-proxy';
import { LanguagesController } from '../controllers/languages-controller';

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

	getAllAvailableProcessors(): (TextProcessor & PluginIdReference)[]
	{
		return this.textProcessors;
	}

	getAllAvailableWordDataProviders(): (WordDataProvider & PluginIdReference)[]
	{
		return this.wordDataProviders;
	}

	getSuggestedTextProcessorsForLanguage(language: Language): TextProcessor[]
	{
		return this.textProcessors.filter(
			(textProcessor: TextProcessor) => {
				if (Array.isArray(textProcessor.supportedLanguages))
				{
					return textProcessor.supportedLanguages.includes(language.templateCode.split(':')[0]);
				}
				
				return textProcessor.supportedLanguages === this.api.symbols.anyLanguage;
			}
		);
	}

	getSuggestedWordDataProvidersForLanguage(language: Language): WordDataProvider[]
	{
		return this.wordDataProviders.filter(
			(wordDataProvider: WordDataProvider) => {
				return (wordDataProvider.targetLanguage + ':' + wordDataProvider.auxiliaryLanguage)
					== (language.templateCode.split(':')[0]);
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

	async provideWordData(wordContent: string, wordDataProvider: WordDataProvider): Promise<DictionaryWordData | null>
	{
		return await wordDataProvider.getWordData(wordContent);
	}

	getTextProcessorsReferencesForLanguage(language: Language): TextProcessorReference[]
	{
		return JSON.parse(language.textProcessors).map(
			(textProcessorFullId: string) => {
				return {
					pluginId: textProcessorFullId.split('/')[0],
					textProcessorId: textProcessorFullId.split('/')[1]
				};
			}
		);
	}

	getWordDataProviderReferenceForLanguage(language: Language): WordDataProviderReference
	{
		return {
			pluginId: language.wordDataProvider.split('/')[0],
			wordDataProviderId: language.wordDataProvider.split('/')[1],
		};
	}

	prepare(): void
	{
		const languages = new LanguagesController().getAllLanguages();

		for (const language of languages)
		{
			this.prepareLanguage(language);
		}
	}

	prepareLanguage(language: Language): void
	{
		const textProcessors = this.getActualTextProcessorsForLanguage(language);
		for (const textProcessor of textProcessors)
		{
			textProcessor.prepare?.();
		}

		const wordDataProvider = this.getActualWordDataProviderForLanguage(language);
		if (wordDataProvider)
		{
			wordDataProvider.prepare?.();
		}
	}

	getActualTextProcessorsForLanguage(language: Language): (TextProcessor & PluginIdReference)[]
	{
		const textProcessorReferences: TextProcessorReference[] = this.getTextProcessorsReferencesForLanguage(language);
	
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

	getActualWordDataProviderForLanguage(language: Language): (WordDataProvider & PluginIdReference) | undefined
	{
		const wordDataProviderReference: WordDataProviderReference = this.getWordDataProviderReferenceForLanguage(language);

		const wordDataProvider = this.wordDataProviders.find(
			(wordDataProvider: (WordDataProvider & PluginIdReference)) => 
				wordDataProvider.pluginId === wordDataProviderReference.pluginId
					&& wordDataProvider.id === wordDataProviderReference.wordDataProviderId
		);

		return wordDataProvider;
	}

	async processTextInLanguage(text: string, language: Language): Promise<string>
	{
		const textProcessors = this.getActualTextProcessorsForLanguage(language);

		return this.processText(text, textProcessors);
	}

	async provideWordDataInLanguage(wordContent: string, language: Language): Promise<DictionaryWordData | null>
	{
		const wordDataProvider = this.getActualWordDataProviderForLanguage(language);
		if (wordDataProvider)
		{
			return this.provideWordData(wordContent, wordDataProvider);
		}

		return null;
	}
}

const pluginManager: PluginManager = new PluginManager();

export { pluginManager };
