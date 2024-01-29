/* 
 * Irakur - Learn languages through immersion
 * Copyright (C) 2023-2024 Ander "Laquin" Aginaga San Sebastián
 * Licensed under version 3 of the GNU Affero General Public License
 */

const irakurQueries =
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
        content TEXT NOT NULL,
        source_url TEXT,
        FOREIGN KEY(language_id) REFERENCES language(id)
    )`,
    createWordTable: `CREATE TABLE IF NOT EXISTS word (
        id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
        language_id INTEGER NOT NULL,
        content TEXT NOT NULL,
        status INTEGER NOT NULL DEFAULT 0,
        meaning TEXT,
        notes TEXT,
        reading TEXT,
        datetime_added TEXT NOT NULL,
        datetime_updated TEXT NOT NULL,
        FOREIGN KEY(language_id) REFERENCES language(id)
    )`,
};

export { irakurQueries }