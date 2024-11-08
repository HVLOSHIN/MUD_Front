import React from 'react';
import './App.css';
import AppRouter from './router/Router';
import {AuthProvider} from "./context/AuthContext";
import {BrowserRouter} from "react-router-dom";
import Header from "./components/Header";
import {ActionPointProvider} from "./context/ActionPointContext";
import {EquipmentProvider} from "./context/EquipmentContext";
import {MasteryProvider} from "./context/MasteryContext";
import {StatContextProvider} from "./context/StatContext";


function App() {
    return (
        <div className="App">
            <BrowserRouter>
                <AuthProvider>
                    <ActionPointProvider>
                        <StatContextProvider>
                            <MasteryProvider>
                                <EquipmentProvider>
                                    <Header/>
                                    <div className="Content">
                                        <AppRouter/>
                                    </div>
                                </EquipmentProvider>
                            </MasteryProvider>
                        </StatContextProvider>
                    </ActionPointProvider>
                </AuthProvider>
            </BrowserRouter>
        </div>
    );
}

export default App;
