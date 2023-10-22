import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Auth } from "./components/auth";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Home } from './components/home';

function App() {



  return (
    <>
    
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Auth />} />
      </Routes>
    </BrowserRouter>
    </>
    
  )
}
export default App
