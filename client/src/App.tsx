/* 
 * Irakur - Learn languages through immersion
 * Copyright (C) 2023-2024 Ander "Laquin" Aginaga San Sebastián
 * Licensed under version 3 of the GNU Affero General Public License
 */

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Home } from './Pages/Home';
import { Texts } from './Pages/Texts';
import { AddText } from './Pages/AddText';
import { EditText } from './Pages/EditText';
import { Languages } from './Pages/Languages';
import { AddLanguage } from './Pages/AddLanguage';
import { EditLanguage } from './Pages/EditLanguage';
import { Settings } from './Pages/Settings';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/texts" element={<Texts />} />
        <Route path="/texts/add" element={<AddText />} />
        <Route path="/texts/edit/:id" element={<EditText />} />
        <Route path="/languages" element={<Languages />} />
        <Route path="/languages/add" element={<AddLanguage />} />
        <Route path="/languages/edit/:id" element={<EditLanguage />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </BrowserRouter>
  );
};

export { App };