/* 
 * Irakur - Learn languages through immersion
 * Copyright (C) 2023-2024 Ander "Laquin" Aginaga San Sebastián
 * Licensed under version 3 of the GNU Affero General Public License
 */

import express from 'express';

import { LanguagesController } from '../controllers/languages-controller';
import { TextsController } from '../controllers/texts-controller';
import { PagesController } from '../controllers/pages-controller';
import { WordsController } from '../controllers/words-controller';

const languagesController = new LanguagesController();
const textsController = new TextsController();
const pagesController = new PagesController();
const wordsController = new WordsController();

const router = express.Router();

//#region Languages
router.get(
    '/languages/',
    async (req:express.Request, res:express.Response) => {
        res.json({languages: await languagesController.getAllLanguages()});
    }
);
router.get(
    '/languages/:languageId',
    async (req:express.Request, res:express.Response) => {
        res.json({language: await languagesController.getLanguage(parseInt(req.params.languageId))});
    }
);
router.post(
    '/languages/',
    async (req:express.Request, res:express.Response) => {
        if(await languagesController.addLanguage(req.body.name, req.body.dictionaryUrl, req.body.shouldShowSpaces))
        {
            res.sendStatus(200);
        }
        else
        {
            res.sendStatus(500);
        }
    }
);
router.delete(
    '/languages/:languageId',
    async (req:express.Request, res:express.Response) => {
        if(await languagesController.deleteLanguage(parseInt(req.params.languageId)))
        {
            res.sendStatus(200);
        }
        else
        {
            res.sendStatus(500);
        }
    }
);
router.patch(
    '/languages/:languageId',
    async (req:express.Request, res:express.Response) => {
        if(await languagesController.editLanguage(parseInt(req.params.languageId), req.body.name, req.body.dictionaryUrl, req.body.shouldShowSpaces))
        {
            res.sendStatus(200);
        }
        else
        {
            res.sendStatus(500);
        }
    }
);
//#endregion

//#region Texts
router.get(
    '/texts/',
    async (req:express.Request, res:express.Response) => {
        if(req.query.languageId !== undefined)
        {
            res.json({texts: await textsController.getTextsByLanguage(parseInt(req.query.languageId as string))});
        }
        else
        {
            res.json({texts: await textsController.getAllTexts()});
        }
    }
);
router.get(
    '/texts/:textId',
    async (req:express.Request, res:express.Response) => {
        res.json(
            {
                text: await textsController.getText(parseInt(req.params.textId)),
                numberOfPages: await textsController.getNumberOfPages(parseInt(req.params.textId))
            }
        );
    }
);
router.post(
    '/texts/',
    async (req:express.Request, res:express.Response) => {
        if(await textsController.addText(req.body.languageId, req.body.title, req.body.content, req.body.sourceUrl, req.body.numberOfPages))
        {
            res.sendStatus(200);
        }
        else
        {
            res.sendStatus(500);
        }
    }
);
router.delete(
    '/texts/:textId',
    async (req:express.Request, res:express.Response) => {
        if(await textsController.deleteText(parseInt(req.params.textId)))
        {
            res.sendStatus(200);
        }
        else
        {
            res.sendStatus(500);
        }
    }
);
router.patch(
    '/texts/:textId',
    async (req:express.Request, res:express.Response) => {
        if(await textsController.editText(req.body.languageId, req.body.title, req.body.sourceUrl, req.body.numberOfPages, req.body.content, parseInt(req.params.textId)))
        {
            res.sendStatus(200);
        }
        else
        {
            res.sendStatus(500);
        }
    }
);
//#endregion

//#region Pages
router.get(
    '/texts/:textId/pages/',
    async (req:express.Request, res:express.Response) => {
        res.json({pages: await pagesController.getAllPages(parseInt(req.params.textId))});
    }
);
router.get(
    '/texts/:textId/pages/:pageId',
    async (req:express.Request, res:express.Response) => {
        res.json({page: await pagesController.getPage(parseInt(req.params.textId), parseInt(req.params.pageId))});
    }
);
router.get(
    '/texts/:textId/pages/:pageId/words',
    async (req:express.Request, res:express.Response) => {
        res.json({words: await pagesController.getWords(parseInt(req.params.textId), parseInt(req.params.pageId))});
    }
);
router.patch(
    '/texts/:textId/pages/:pageId',
    async (req:express.Request, res:express.Response) => {
        if(await pagesController.editPage(parseInt(req.params.textId), req.body.index, req.body.content, parseInt(req.params.pageId)))
        {
            res.sendStatus(200);
        }
        else
        {
            res.sendStatus(500);
        }
    }
);
//#endregion

//#region Words
router.get(
    '/words/:wordId',
    async (req:express.Request, res:express.Response) => {
        res.json({word: await wordsController.getWord(parseInt(req.params.wordId))});
    }
);
router.post(
    '/words/',
    async (req:express.Request, res:express.Response) => {
        if(await wordsController.addWord(req.body.languageId, req.body.content, req.body.status, req.body.entries, req.body.notes, req.body.datetimeAdded, req.body.datetimeUpdated))
        {
            res.sendStatus(200);
        }
        else
        {
            res.sendStatus(500);
        }
    }
);
router.delete(
    '/words/:wordId',
    async (req:express.Request, res:express.Response) => {
        if(await wordsController.deleteWord(parseInt(req.params.wordId)))
        {
            res.sendStatus(200);
        }
        else
        {
            res.sendStatus(500);
        }
    }
);
router.patch(
    '/words/:wordId',
    async (req:express.Request, res:express.Response) => {
        if(await wordsController.editWord(req.body.languageId, req.body.content, req.body.status, req.body.entries, req.body.notes, req.body.datetimeAdded, req.body.datetimeUpdated, parseInt(req.params.wordId)))
        {
            res.sendStatus(200);
        }
        else
        {
            res.sendStatus(500);
        }
    }
);
//#endregion

export { router };