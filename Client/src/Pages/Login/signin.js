import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import './signin.css';
import logo from "../../Assets/Icons/rabbit.png";
import { backend_url } from "../../Components/Configurations";
import { useAuth } from "../../Components/Authentication/AuthContext";

const SignIn = () => {
    const [ user, setUser ] = useState({
        "username": '',
        "password": ''
    })

    const [ userInput, setUserInput ] = useState(false);
    const [ passwordInput, setPasswordInput ] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    function handleChange(e){
        const { name, value } = e.target;

        setUser((prevUser) => ({
            ...prevUser,
            [name]: value
        }))
    }


    const handleSubmit = async ( e ) => {
        if (user.username === "" | user.password === ""){
            alert("Employee Id or password field can not be empty.")
            return
        }
        try{
            const response = await fetch(`${backend_url}/user/login/`,{
                method: 'post',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(user)
            });

            if (!response.ok){
                const errorData = await response.json();
                if (errorData['message'] === 'Invalid Employee Id or Password'){
                    alert(errorData['message'])
                    return;
                }
                alert(errorData['message']['non_field_errors'][0]);
            }

            const data = await response.json();
            login(data);
            navigate('/EmpHome');
            
        } catch(error){
            console.log('Network Error: ', error.message)
        }
    }


    return(
        <div className="container signin-page">
            <div className="signin-body">
                <div className="mt-5">
                    <img src={logo} alt="..loading" className="mb-4" height="75px"/>
                    <p className="signin-header">Sign In to TaskRabbit</p>
                </div>
                
                <div className="input-body">
                    <label className="input-label">Employee Id</label>
                    <input type="text" name="username" value={user['username']} onChange={(e) => handleChange(e)} onClick={() => setUserInput(!userInput)} className="input-field"/>
                </div>
                <div className="input-body">
                    <div>
                        <label className="input-label">Password</label>
                        <label>Forgot?</label>
                    </div>
                    <input className="input-field" type="password" name="password" value={user['password']} onChange={(e) => handleChange(e)} onClick={(e) => {e.preventDefault(); setPasswordInput(!passwordInput)}} />
                </div>
                <div>
                    <button className="button-body" onClick={handleSubmit}>Submit</button>
                </div>
            </div>
        </div>
    )
}

export default SignIn;