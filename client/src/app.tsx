/* 
 * Irakur - Learn languages through immersion
 * Copyright (C) 2023-2024 Ander "Laquin" Aginaga San Sebastián
 * Licensed under version 3 of the GNU Affero General Public License
 */

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Home } from './pages/home';
import { Texts } from './pages/texts';
import { AddText } from './pages/add-text';
import { EditText } from './pages/edit-text';
import { Languages } from './pages/languages';
import { AddLanguage } from './pages/add-language';
import { EditLanguage } from './pages/edit-language';

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
			</Routes>
		</BrowserRouter>
	);
};

export { App };