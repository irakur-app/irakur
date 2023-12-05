const textQueries =
{
    getTexts: 'SELECT * FROM text WHERE language_id = ?',
    getText: 'SELECT * FROM text WHERE id = ?',
    addText: 'INSERT INTO text (language_id, title, content, source_url) VALUES (?, ?, ?, ?)',
    deleteText: 'DELETE FROM text WHERE id = ?',
    editText: 'UPDATE text SET title = ?, content = ?, source_url = ? WHERE id = ?',
}

module.exports = textQueries;