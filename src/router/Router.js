import React from 'react';
import {Navigate, Route, Routes} from 'react-router-dom';
import Hello from "../pages/Hello";
import Home from "../pages/user/Home";
import SignUp from "../pages/user/SignUp";
import Login from "../pages/user/Login";
import Dashboard from "../pages/user/Dashboard";
import Stats from "../pages/stats/Stats";
import Logout from "../pages/user/Logout";
import Field from "../pages/field/Field";
import FieldDetail from "../pages/field/FieldDetail";
import Combat from "../pages/combat/Combat";


function AppRouter() {
    return (
        <Routes>
            <Route path="/test" element={<Hello/>}/>
            <Route path="/" element={<Home/>}/>
            <Route path="/signup" element={<SignUp/>}/>
            <Route path="/login" element={<Login/>}/>
            <Route path="/logout" element={<Logout/>}/>


            <Route path="/dashboard" element={<Dashboard/>}/>
            <Route path="/stats" element={<Stats/>}/>
            <Route path="/field" element={<Field/>}/>
            <Route path="/field/:fieldId" element={<FieldDetail/>}/>
            <Route path="/combat" element={<Combat/>}/>


        </Routes>
    )
}
export default AppRouter;