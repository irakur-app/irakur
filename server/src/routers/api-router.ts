/*
 * Irakur - Learn languages through immersion
 * Copyright (C) 2023-2024 Ander Aginaga San Sebastián (a.k.a. Laquin or Laquinh)
 * Licensed under version 3 of the GNU Affero General Public License
 */

import express from 'express';

import { Language } from '@common/types';
import { dataFolderManager } from '../managers/data-folder-manager';
import { LanguagesController } from '../controllers/languages-controller';
import { PagesController } from '../controllers/pages-controller';
import { pluginManager } from '../plugins/plugin-manager';
import { StatisticsController } from '../controllers/statistics-controller';
import { TextsController } from '../controllers/texts-controller';
import { WordsController } from '../controllers/words-controller';

const languagesController = new LanguagesController();
const textsController = new TextsController();
const pagesController = new PagesController();
const wordsController = new WordsController();
const statisticsController = new StatisticsController();

const router = express.Router();

const errorWrapper = (handler: express.RequestHandler): express.RequestHandler => {
	return (req: express.Request, res: express.Response, next: express.NextFunction): void => {
		try
		{
			handler(req, res, next);
		}
		catch (error)
		{
			console.error(error);
			res.sendStatus(500);
		}
	};
};

//#region Languages
router.get(
	'/languages/',
	errorWrapper(
		(req: express.Request, res: express.Response): void => {
			res.json({ languages: languagesController.getAllLanguages() });
		}
	)
);
router.get(
	'/languages/:languageId',
	errorWrapper(
		(req: express.Request, res: express.Response): void => {
			res.json(languagesController.getLanguage(parseInt(req.params.languageId)));
		}
	)
);
router.post(
	'/languages/',
	errorWrapper(
		(req: express.Request, res: express.Response): void => {
			languagesController.addLanguage(
				req.body.name,
				req.body.dictionaryUrl,
				req.body.shouldShowSpaces,
				req.body.alphabet,
				req.body.sentenceDelimiters,
				req.body.whitespaces,
				req.body.intrawordPunctuation,
				req.body.templateCode,
				req.body.scriptName,
				req.body.textProcessorFullIds
			);
			res.sendStatus(200);
		}
	)
);
router.delete(
	'/languages/:languageId',
	errorWrapper(
		(req: express.Request, res: express.Response): void => {
			languagesController.deleteLanguage(parseInt(req.params.languageId));
			res.sendStatus(200);
		}
	)
);
router.patch(
	'/languages/:languageId',
	errorWrapper(
		(req: express.Request, res: express.Response): void => {
			languagesController.editLanguage(
				parseInt(req.params.languageId),
				req.body.name,
				req.body.dictionaryUrl,
				req.body.shouldShowSpaces,
				req.body.alphabet,
				req.body.sentenceDelimiters,
				req.body.whitespaces,
				req.body.intrawordPunctuation
			);
			res.sendStatus(200);
		}
	)
);
//#endregion

//#region Texts
router.get(
	'/texts/',
	errorWrapper(
		(req: express.Request, res: express.Response): void => {
			if (req.query.languageId !== undefined)
			{
				res.json({ texts: textsController.getTextsByLanguage(parseInt(req.query.languageId as string)) });
			}
			else
			{
				res.json({ texts: textsController.getAllTexts() });
			}
		}
	)
);
router.get(
	'/texts/:textId',
	errorWrapper(
		(req: express.Request, res: express.Response): void => {
			res.json(
				{
					...textsController.getText(parseInt(req.params.textId)),
					numberOfPages: textsController.getNumberOfPages(parseInt(req.params.textId)),
				}
			);
		}
	)
);
router.post(
	'/texts/',
	errorWrapper(
		(req: express.Request, res: express.Response): void => {
			textsController.addText(
				req.body.languageId,
				req.body.title,
				req.body.content,
				req.body.sourceUrl,
				req.body.numberOfPages
			);
			res.sendStatus(200);
		}
	)
);
router.delete(
	'/texts/:textId',
	errorWrapper(
		(req: express.Request, res: express.Response): void => {
			textsController.deleteText(parseInt(req.params.textId));
			res.sendStatus(200);
		}
	)
);
router.patch(
	'/texts/:textId',
	errorWrapper(
		(req: express.Request, res: express.Response): void => {
			textsController.editText(
				req.body.languageId,
				req.body.title,
				req.body.sourceUrl,
				req.body.numberOfPages,
				req.body.content,
				parseInt(req.params.textId),
				req.body.timeOpened,
				req.body.timeFinished,
				req.body.progress
			);
			res.sendStatus(200);
		}
	)
);
//#endregion

//#region Pages
router.get(
	'/texts/:textId/pages/',
	errorWrapper(
		(req: express.Request, res: express.Response): void => {
			res.json({ pages: pagesController.getPagesByText(parseInt(req.params.textId)) });
		}
	)
);
router.get(
	'/texts/:textId/pages/:pagePosition',
	errorWrapper(
		(req: express.Request, res: express.Response): void => {
			res.json(pagesController.getPage(parseInt(req.params.textId), parseInt(req.params.pagePosition)));
		}
	)
);
router.get(
	'/texts/:textId/pages/:pagePosition/words',
	errorWrapper(
		(req: express.Request, res: express.Response): void => {
			res.json(
				{
					words: pagesController.getWords(parseInt(req.params.textId), parseInt(req.params.pagePosition)),
				}
			);
		}
	)
);
//#endregion

//#region Words
router.get(
	'/words/',
	errorWrapper(
		(req: express.Request, res: express.Response): void => {
			if (req.query.languageId !== undefined && req.query.content !== undefined)
			{
				const word = wordsController.findWord(
					req.query.content as string,
					parseInt(req.query.languageId as string)
				);

				if (word)
				{
					res.json(word);
				}
				else
				{
					res.sendStatus(404);
				}
			}
			else
			{
				res.sendStatus(500);
			}
		}
	)
);
router.get(
	'/words/:wordId',
	errorWrapper(
		(req: express.Request, res: express.Response): void => {
			res.json(wordsController.getWord(parseInt(req.params.wordId)));
		}
	)
);
router.post(
	'/words/',
	errorWrapper(
		(req: express.Request, res: express.Response): void => {
			wordsController.addWord(
				req.body.languageId,
				req.body.content,
				req.body.status,
				req.body.entries,
				req.body.notes,
				req.body.timeAdded,
				req.body.timeUpdated
			);
			res.sendStatus(200);
		}
	)
);
router.post(
	'/words/batch',
	errorWrapper(
		(req: express.Request, res: express.Response): void => {
			wordsController.addWordsInBatch(
				req.body.languageId,
				req.body.contents,
				req.body.status,
				req.body.timeAdded
			);
			res.sendStatus(200);
		}
	)
)
router.delete(
	'/words/:wordId',
	errorWrapper(
		(req: express.Request, res: express.Response): void => {
			wordsController.deleteWord(parseInt(req.params.wordId));
			res.sendStatus(200);
		}
	)
);
router.patch(
	'/words/:wordId',
	errorWrapper(
		(req: express.Request, res: express.Response): void => {
			wordsController.editWord(
				req.body.languageId,
				req.body.content,
				req.body.status,
				req.body.entries,
				req.body.notes,
				req.body.timeAdded,
				req.body.timeUpdated,
				parseInt(req.params.wordId)
			);
			res.sendStatus(200);
		}
	)
);
//#endregion

//#region Statistics
router.get(
	'/statistics/words-improved-count/:languageId',
	errorWrapper(
		(req: express.Request, res: express.Response): void => {
			res.json(statisticsController.getWordsImprovedCount(parseInt(req.params.languageId)));
		}
	)
);
//#endregion

//#region Profiles
router.get(
	'/profiles/',
	errorWrapper(
		(req: express.Request, res: express.Response): void => {
			res.json({ profiles: dataFolderManager.getProfileNames() });
		}
	)
);
router.get(
	'/profiles/active',
	errorWrapper(
		(req: express.Request, res: express.Response): void => {
			const profileName: string | null = dataFolderManager.getActiveProfile();

			if (profileName)
			{
				res.json({ profileName });
			}
			else
			{
				res.sendStatus(404);
			}
		}
	)
);
router.post(
	'/profiles/',
	errorWrapper(
		(req: express.Request, res: express.Response): void => {
			dataFolderManager.createProfile(req.body.profileName);
			res.sendStatus(200);
		}
	)
);
router.post(
	'/profiles/active',
	errorWrapper(
		(req: express.Request, res: express.Response): void => {
			dataFolderManager.setActiveProfile(req.body.profileName);
			res.sendStatus(200);
		}
	)
);
router.delete(
	'/profiles/:profileName',
	errorWrapper(
		(req: express.Request, res: express.Response): void => {
			dataFolderManager.deleteProfile(req.params.profileName);
			res.sendStatus(200);
		}
	)
);
router.patch(
	'/profiles/:profileName',
	errorWrapper(
		(req: express.Request, res: express.Response): void => {
			dataFolderManager.renameProfile(req.params.profileName, req.body.newProfileName);
			res.sendStatus(200);
		}
	)
);
//#endregion

//#region Plugins
router.get(
	'/plugins/text-processors',
	errorWrapper(
		async (req: express.Request, res: express.Response): Promise<void> => {
			res.json(
				{
					textProcessors: (await pluginManager.getAllAvailableProcessors()).map(
						(textProcessor) => {
							return {
								id: textProcessor.id,
								name: textProcessor.name,
								languages: Array.isArray(textProcessor.languages)
									? textProcessor.languages
									: textProcessor.languages.description,
								pluginId: textProcessor.pluginId
							}
						}
					)
				}
			);
		}
	)
);

router.post(
	'/plugins/start',
	errorWrapper(
		(req: express.Request, res: express.Response): void => {
			pluginManager.startPlugins();
			res.sendStatus(200);
		}
	)
);

router.post(
	'/plugins/process-text',
	errorWrapper(
		async (req: express.Request, res: express.Response): Promise<void> => {
			const language: Language = await languagesController.getLanguage(req.body.languageId);
			res.json({ text: await pluginManager.processTextInLanguage(req.body.text, language) });
		}
	)
);

export { router };
