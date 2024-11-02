import React from 'react';
import {Navigate, Route, Routes} from 'react-router-dom';
import Hello from "../Hello";
import Home from "../user/Home";
import SignUp from "../user/SignUp";
import Login from "../user/Login";
import Dashboard from "../user/Dashboard";


function AppRouter() {
    return (
        <Routes>
            <Route path="/test" element={<Hello/>}/>
            <Route path="/" element={<Home/>}/>
            <Route path="/signup" element={<SignUp/>}/>
            <Route path="/login" element={<Login/>}/>

            <Route path="/dashboard" element={<Dashboard/>}/>

        </Routes>
    )
}
export default AppRouter;