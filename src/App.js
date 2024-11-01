import React from 'react';
import './App.css';
import AppRouter from './pages/router/Router';
import {BrowserRouter} from "react-router-dom";


function App() {
  return (
    <div className="App">

        <BrowserRouter>
        <div className="Content">
            <AppRouter/>
        </div>
        </BrowserRouter>
    </div>
  );
}

export default App;
