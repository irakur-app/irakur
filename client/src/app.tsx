/*
 * Irakur - Learn languages through immersion
 * Copyright (C) 2023-2024 Ander "Laquin" Aginaga San Sebastián
 * Licensed under version 3 of the GNU Affero General Public License
 */

import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { AddLanguage } from './pages/add-language';
import { AddText } from './pages/add-text';
import { EditLanguage } from './pages/edit-language';
import { EditText } from './pages/edit-text';
import { Home } from './pages/home';
import { Languages } from './pages/languages';
import { ReadText } from './pages/read-text';
import { Texts } from './pages/texts';

const App = (): JSX.Element => {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/texts" element={<Texts />} />
				<Route path="/texts/add" element={<AddText />} />
				<Route path="/texts/edit/:id" element={<EditText />} />
				<Route path="/texts/read/:id" element={<ReadText />} />
				<Route path="/languages" element={<Languages />} />
				<Route path="/languages/add" element={<AddLanguage />} />
				<Route path="/languages/edit/:id" element={<EditLanguage />} />
			</Routes>
		</BrowserRouter>
	);
};

export { App };
