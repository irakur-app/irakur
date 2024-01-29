/* 
 * Irakur - Learn languages through immersion
 * Copyright (C) 2023-2024 Ander "Laquin" Aginaga San Sebastián
 * Licensed under version 3 of the GNU Affero General Public License
 */

const languageQueries =
{
    getLanguages: 'SELECT * FROM language',
    getLanguage: 'SELECT * FROM language WHERE id = ?',
    addLanguage: 'INSERT INTO language (name, dictionary_url, should_show_spaces) VALUES (?, ?, ?)',
    deleteLanguage: 'DELETE FROM language WHERE id = ?',
    editLanguage: 'UPDATE language SET name = ?, dictionary_url = ?, should_show_spaces = ? WHERE id = ?',
    getActiveLanguage: "SELECT language.* FROM language JOIN configuration ON language.id = configuration.value WHERE configuration.key = 'active_language'",
    setActiveLanguage: "REPLACE INTO configuration (key, value) VALUES ('active_language', ?)"
}

module.exports = languageQueries;