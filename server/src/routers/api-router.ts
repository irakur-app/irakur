/*
 * Irakur - Learn languages through immersion
 * Copyright (C) 2023-2024 Ander "Laquin" Aginaga San Sebastián
 * Licensed under version 3 of the GNU Affero General Public License
 */

import express from 'express';

import { LanguagesController } from '../controllers/languages-controller';
import { PagesController } from '../controllers/pages-controller';
import { TextsController } from '../controllers/texts-controller';
import { WordsController } from '../controllers/words-controller';

const languagesController = new LanguagesController();
const textsController = new TextsController();
const pagesController = new PagesController();
const wordsController = new WordsController();

const router = express.Router();

const errorWrapper = (handler: express.RequestHandler): express.RequestHandler => {
	return async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
		try
		{
			await handler(req, res, next);
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
		async (req: express.Request, res: express.Response): Promise<void> => {
			res.json({ languages: await languagesController.getAllLanguages() });
		}
	)
);
router.get(
	'/languages/:languageId',
	errorWrapper(
		async (req: express.Request, res: express.Response): Promise<void> => {
			res.json(await languagesController.getLanguage(parseInt(req.params.languageId)));
		}
	)
);
router.post(
	'/languages/',
	errorWrapper(
		async (req: express.Request, res: express.Response): Promise<void> => {
			await languagesController.addLanguage(req.body.name, req.body.dictionaryUrl, req.body.shouldShowSpaces);
			res.sendStatus(200);
		}
	)
);
router.delete(
	'/languages/:languageId',
	errorWrapper(
		async (req: express.Request, res: express.Response): Promise<void> => {
			await languagesController.deleteLanguage(parseInt(req.params.languageId));
			res.sendStatus(200);
		}
	)
);
router.patch(
	'/languages/:languageId',
	errorWrapper(
		async (req: express.Request, res: express.Response): Promise<void> => {
			await languagesController.editLanguage(
				parseInt(req.params.languageId),
				req.body.name,
				req.body.dictionaryUrl,
				req.body.shouldShowSpaces
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
		async (req: express.Request, res: express.Response): Promise<void> => {
			if (req.query.languageId !== undefined)
			{
				res.json({ texts: await textsController.getTextsByLanguage(parseInt(req.query.languageId as string)) });
			}
			else
			{
				res.json({ texts: await textsController.getAllTexts() });
			}
		}
	)
);
router.get(
	'/texts/:textId',
	errorWrapper(
		async (req: express.Request, res: express.Response): Promise<void> => {
			res.json(
				{
					...await textsController.getText(parseInt(req.params.textId)),
					numberOfPages: await textsController.getNumberOfPages(parseInt(req.params.textId)),
				}
			);
		}
	)
);
router.post(
	'/texts/',
	errorWrapper(
		async (req: express.Request, res: express.Response): Promise<void> => {
			await textsController.addText(
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
		async (req: express.Request, res: express.Response): Promise<void> => {
			await textsController.deleteText(parseInt(req.params.textId));
			res.sendStatus(200);
		}
	)
);
router.patch(
	'/texts/:textId',
	errorWrapper(
		async (req: express.Request, res: express.Response): Promise<void> => {
			await textsController.editText(
				req.body.languageId,
				req.body.title,
				req.body.sourceUrl,
				req.body.numberOfPages,
				req.body.content,
				parseInt(req.params.textId),
				req.body.datetimeOpened,
				req.body.datetimeFinished,
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
		async (req: express.Request, res: express.Response): Promise<void> => {
			res.json({ pages: await pagesController.getPagesByText(parseInt(req.params.textId)) });
		}
	)
);
router.get(
	'/texts/:textId/pages/:pageId',
	errorWrapper(
		async (req: express.Request, res: express.Response): Promise<void> => {
			res.json(await pagesController.getPage(parseInt(req.params.textId), parseInt(req.params.pageId)));
		}
	)
);
router.get(
	'/texts/:textId/pages/:pageId/words',
	errorWrapper(
		async (req: express.Request, res: express.Response): Promise<void> => {
			res.json(
				{
					words: await pagesController.getWords(parseInt(req.params.textId), parseInt(req.params.pageId)),
				}
			);
		}
	)
);
router.patch(
	'/texts/:textId/pages/:pageId',
	errorWrapper(
		async (req: express.Request, res: express.Response): Promise<void> => {
			await pagesController.editPage(
				parseInt(req.params.textId),
				req.body.index,
				req.body.content,
				parseInt(req.params.pageId)
			);
			res.sendStatus(200);
		}
	)
);
//#endregion

//#region Words
router.get(
	'/words/',
	errorWrapper(
		async (req: express.Request, res: express.Response): Promise<void> => {
			if (req.query.languageId !== undefined && req.query.content !== undefined)
			{
				const word = await wordsController.findWord(
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
		async (req: express.Request, res: express.Response): Promise<void> => {
			res.json(await wordsController.getWord(parseInt(req.params.wordId)));
		}
	)
);
router.post(
	'/words/',
	errorWrapper(
		async (req: express.Request, res: express.Response): Promise<void> => {
			await wordsController.addWord(
				req.body.languageId,
				req.body.content,
				req.body.status,
				req.body.entries,
				req.body.notes,
				req.body.datetimeAdded,
				req.body.datetimeUpdated
			);
			res.sendStatus(200);
		}
	)
);
router.post(
	'/words/batch',
	errorWrapper(
		async (req: express.Request, res: express.Response): Promise<void> => {
			await wordsController.addWordsInBatch(
				req.body.languageId,
				req.body.contents,
				req.body.status,
				req.body.datetimeAdded
			);
			res.sendStatus(200);
		}
	)
)
router.delete(
	'/words/:wordId',
	errorWrapper(
		async (req: express.Request, res: express.Response): Promise<void> => {
			await wordsController.deleteWord(parseInt(req.params.wordId));
			res.sendStatus(200);
		}
	)
);
router.patch(
	'/words/:wordId',
	errorWrapper(
		async (req: express.Request, res: express.Response): Promise<void> => {
			await wordsController.editWord(
				req.body.languageId,
				req.body.content,
				req.body.status,
				req.body.entries,
				req.body.notes,
				req.body.datetimeAdded,
				req.body.datetimeUpdated,
				parseInt(req.params.wordId)
			);
			res.sendStatus(200);
		}
	)
);
//#endregion

export { router };
