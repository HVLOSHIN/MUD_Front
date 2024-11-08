import React from 'react';
import './App.css';
import AppRouter from './router/Router';
import {AuthProvider} from "./context/AuthContext";
import {BrowserRouter} from "react-router-dom";
import Header from "./components/Header";
import {UserProvider} from "./context/UserContext";
import {EquipmentProvider} from "./context/EquipmentContext";
import {MasteryProvider} from "./context/MasteryContext";


function App() {
    return (
        <div className="App">
            <BrowserRouter>
                <AuthProvider>
                    <UserProvider>
                        <MasteryProvider>
                            <EquipmentProvider>
                                <Header/>
                                <div className="Content">
                                    <AppRouter/>
                                 </div>
                            </EquipmentProvider>
                        </MasteryProvider>
                    </UserProvider>
                </AuthProvider>
            </BrowserRouter>
        </div>
    );
}

export default App;
