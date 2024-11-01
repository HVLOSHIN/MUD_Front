import React from 'react';
import {Navigate, Route, Routes} from 'react-router-dom';
import Hello from "../Hello";


function AppRouter() {
    return (
        <Routes>
            <Route path="/test" element={<Hello/>}/>

        </Routes>
    )
}
export default AppRouter;