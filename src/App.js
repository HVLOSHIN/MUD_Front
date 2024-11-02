import React from 'react';
import './App.css';
import AppRouter from './pages/router/Router';
import {AuthProvider} from "./context/AuthContext";
import {BrowserRouter} from "react-router-dom";
import Header from "./pages/components/Header";


function App() {
    return (
        <div className="App">
            <BrowserRouter>
                <AuthProvider>
                    <Header/>
                    <div className="Content">
                        <AppRouter/>
                    </div>
                </AuthProvider>
            </BrowserRouter>
        </div>
    );
}

export default App;
