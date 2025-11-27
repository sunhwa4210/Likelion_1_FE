// src/App.js
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ModalProvider } from './components/Modal/ModalProvider';

import Login from './pages/login/login';
import Signup from './pages/signup/signup';
import PersonalCuration from './pages/curation/PersonalCuration';
import AllCuration from './pages/curation/AllCuration';
import CurationDetail from './pages/curation/CurationDetail';
import SocialRedirect from './pages/social/socialRedirect';

export default function App() {
  return (
    <ModalProvider>
      <Routes>
        <Route path="/signup" element={<Signup />} /> 
        <Route path="/login" element={<Login />} />
        <Route path="/curation/personal" element={<PersonalCuration />} />
        <Route path="/curation" element={<AllCuration />} />
        <Route path="/curation/:curationId" element={<CurationDetail />} />
        <Route path="/social" element={<SocialRedirect />} />
        <Route path="/auth/kakao/callback" element={<SocialRedirect />} />

      </Routes>
    </ModalProvider>
  );
}
    