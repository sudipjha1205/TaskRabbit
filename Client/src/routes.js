import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useAuth, AuthProvider } from "./Components/Authentication/AuthContext";

import SignIn from "./Pages/Login/signin";
import EmpHome from "./Pages/EmpHome/home";

const AppRoutes = () => {
    const { isAuthenticate } = useAuth();

    return(
        <Routes>
            <Route path="/signin" element={<SignIn />} />
            <Route path='/EmpHome' element={<EmpHome />} />
        </Routes>
    )
}

const RouteFunc = () =>{
    return(
        <Router>
            <AuthProvider>
                <AppRoutes />
            </AuthProvider>
        </Router>
    )
}

export default RouteFunc;