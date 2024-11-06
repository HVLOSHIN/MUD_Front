import React from 'react';
import './App.css';
import AppRouter from './router/Router';
import {AuthProvider} from "./context/AuthContext";
import {BrowserRouter} from "react-router-dom";
import Header from "./components/Header";
import {UserProvider} from "./context/UserContext";


function App() {
    return (
        <div className="App">
            <BrowserRouter>
                <AuthProvider>
                    <UserProvider>
                    <Header/>
                    <div className="Content">
                        <AppRouter/>
                    </div>
                    </UserProvider>
                </AuthProvider>
            </BrowserRouter>
        </div>
    );
}

export default App;
