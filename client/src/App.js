import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Home } from './Pages/Home';
import { Texts } from './Pages/Texts';
import { AddText } from './Pages/AddText';
import { Languages } from './Pages/Languages';
import { AddLanguage } from './Pages/AddLanguage';
import { EditLanguage } from './Pages/EditLanguage';
import { Settings } from './Pages/Settings';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route exact path="/texts" element={<Texts />} />
        <Route exact path="/texts/add" element={<AddText />} />
        <Route exact path="/languages" element={<Languages />} />
        <Route exact path="/languages/add" element={<AddLanguage />} />
        <Route exact path="/languages/edit/:id" element={<EditLanguage />} />
        <Route exact path="/settings" element={<Settings />} />
      </Routes>
    </BrowserRouter>
  );
};

export { App };