/* 
 * Irakur - Learn languages through immersion
 * Copyright (C) 2023-2024 Ander "Laquin" Aginaga San Sebastián
 * Licensed under version 3 of the GNU Affero General Public License
 */

const queries: { [key: string]: string } =
{
    createConfigurationTable: `CREATE TABLE IF NOT EXISTS configuration (
        key TEXT NOT NULL PRIMARY KEY,
        value TEXT
    )`,
    createLanguageTable: `CREATE TABLE IF NOT EXISTS language (
        id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE,
        dictionary_url TEXT,
        should_show_spaces INTEGER NOT NULL DEFAULT 1
    )`,
    createTextTable: `CREATE TABLE IF NOT EXISTS text (
        id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
        language_id INTEGER NOT NULL,
        title TEXT NOT NULL,
        source_url TEXT,
        FOREIGN KEY(language_id) REFERENCES language(id)
    )`,
    createPageTable: `CREATE TABLE IF NOT EXISTS page (
        text_id INTEGER NOT NULL,
        number INTEGER NOT NULL,
        content TEXT NOT NULL,
        FOREIGN KEY(text_id) REFERENCES text(id),
        UNIQUE(text_id, number)
    )`,
    createWordTable: `CREATE TABLE IF NOT EXISTS word (
        id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
        language_id INTEGER NOT NULL,
        content TEXT NOT NULL,
        status INTEGER NOT NULL DEFAULT 0,
        entries TEXT,
        notes TEXT,
        datetime_added TEXT NOT NULL,
        datetime_updated TEXT NOT NULL,
        FOREIGN KEY(language_id) REFERENCES language(id)
    )`,

    getAllLanguages: 'SELECT * FROM language',
    getLanguage: 'SELECT * FROM language WHERE id = ?',
    addLanguage: 'INSERT INTO language (name, dictionary_url, should_show_spaces) VALUES (?, ?, ?)',
    deleteLanguage: 'DELETE FROM language WHERE id = ?',
    editLanguage: 'UPDATE language SET %DYNAMIC% WHERE id = ?',

    getAllTexts: 'SELECT * FROM text WHERE language_id = ?',
    getText: 'SELECT * FROM text WHERE id = ?',
    addText: 'INSERT INTO text (language_id, title, source_url) VALUES (?, ?, ?)',
    deleteText: 'DELETE FROM text WHERE id = ?',
    editText: 'UPDATE text SET %DYNAMIC% WHERE id = ?',

    getAllPages: 'SELECT * FROM page WHERE text_id = ?',
    getPage: 'SELECT * FROM page WHERE text_id = ? AND number = ?',
    addPage: 'INSERT INTO page (text_id, number, content) VALUES (?, ?, ?)',
    deletePage: 'DELETE FROM page WHERE text_id = ? AND number = ?',
    editPage: 'UPDATE page SET content = ? WHERE text_id = ? AND number = ?',

    getWord: 'SELECT * FROM word WHERE id = ?',
    findWord: 'SELECT * FROM word WHERE content = ? AND language_id = ?',
    addWord: 'INSERT INTO word (language_id, content, status, entries, notes, datetime_added, datetime_updated) VALUES (?, ?, ?, ?, ?, ?, ?)',
    deleteWord: 'DELETE FROM word WHERE id = ?',
    editWord: 'UPDATE word SET %DYNAMIC% WHERE id = ?'
};

export { queries }