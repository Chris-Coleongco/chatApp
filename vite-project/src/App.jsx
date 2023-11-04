import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { BrowserRouter, Routes, Route, createBrowserRouter, createRoutesFromElements, RouterProvider } from 'react-router-dom';

import { Home } from './components/home';
import { Dashboard } from './components/dashboard';
import { SignUp } from "./components/authentication/signUp";
import { SignIn } from "./components/authentication/signIn";
import { PrivateChat } from './components/privateChat';


function App() {

  const router = createBrowserRouter(
   createRoutesFromElements(
    <>
    <Route path="/" element={<Home />} />
        <Route path="/signUp" element={<SignUp />} />
        <Route path="/signIn" element={<SignIn />} />
        <Route path="/Dashboard" element={<Dashboard />} />

        <Route
          path="friend/:chatID"
          element={<PrivateChat/>}
        />
        </>
   ) 
  )

  return (
    
    <><RouterProvider router={router}/></>
    
    
  )
}
export default App
