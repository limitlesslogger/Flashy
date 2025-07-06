// import { StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'
// import './index.css'
// import App from './App.jsx'

// createRoot(document.getElementById('root')).render(
//   <StrictMode>
//     <App />
//   </StrictMode>,
// )
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import LandingPage from "../pages/LandingPage.jsx";
import Level1 from "../pages/Level1";
import Level2 from "../pages/Level2";
import Level3 from "../pages/Level3";
import Level4 from "../pages/Level4";
import Level5 from "../pages/Level5";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/level1" element={<Level1 />} />
         {/* <Route path="/level2" element={<Level2 />} /> */}
        <Route path="/level2" element={<Level2 />} />
        <Route path="/level3" element={<Level3 />} />
        <Route path="/level4" element={<Level4 />} />
        <Route path="/level5" element={<Level5 />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
