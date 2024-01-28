import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Home } from './Pages/Home';
import { Languages } from './Pages/Languages';
import { AddLanguage } from './Pages/AddLanguage';
import { EditLanguage } from './Pages/EditLanguage';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route exact path="/languages" element={<Languages />} />
        <Route exact path="/languages/add" element={<AddLanguage />} />
        <Route exact path="/languages/edit/:id" element={<EditLanguage />} />
      </Routes>
    </BrowserRouter>
  );
};

export { App };