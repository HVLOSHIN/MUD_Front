import React from 'react';
import './App.css';
import AppRouter from './pages/router/Router';
import {AuthProvider} from "./context/AuthContext";
import {BrowserRouter} from "react-router-dom";


function App() {
  return (
    <div className="App">
        <AuthProvider>
            <BrowserRouter>
                <div className="Content">
                    <AppRouter/>
                </div>
            </BrowserRouter>
        </AuthProvider>
    </div>
  );
}

export default App;
