const languageQueries =
{
    getLanguages: 'SELECT * FROM language',
    getLanguage: 'SELECT * FROM language WHERE id = ?',
    addLanguage: 'INSERT INTO language (name, dictionary_url, should_show_spaces) VALUES (?, ?, ?)',
    deleteLanguage: 'DELETE FROM language WHERE id = ?',
    editLanguage: 'UPDATE language SET name = ?, dictionary_url = ?, should_show_spaces = ? WHERE id = ?'
}

module.exports = languageQueries;