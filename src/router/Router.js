import React from 'react';
import {Navigate, Route, Routes} from 'react-router-dom';
import Hello from "../pages/Hello";
import Home from "../pages/user/Home";
import SignUp from "../pages/user/SignUp";
import Login from "../pages/user/Login";
import Dashboard from "../pages/user/Dashboard";


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