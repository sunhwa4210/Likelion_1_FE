// src/App.js
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ModalProvider } from './components/Modal/ModalProvider';
import SomePage from './pages/SomePage';

export default function App() {
  return (
    <ModalProvider>      {/* 전역 모달 컨텍스트 (그 자체는 어디 있어도 됨) */}
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<SomePage />} />
        </Routes>
      </BrowserRouter>
    </ModalProvider>
  );
}
