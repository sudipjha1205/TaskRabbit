import React from "react";
import { useState, useEffect } from "react";

import { backend_url } from "../../Components/Configurations";
import Tasks from "./tasks";
import TaskList from "./taskList";
import TaskListPhone from "./taskListPhone";

import './home.css';

const EmpHome = () => {
    const [ user,setUser] = useState();
    const [ taskList, setTasksList ] = useState();
    const [ isMobile, setIsMobile ] = useState(false);

    const userDetails = JSON.parse(sessionStorage.getItem('user'))
    const token = userDetails['user']['token']
    const employee_id = userDetails['user']['username']

    const handleResize = () => {
        const mobileQuery = window.matchMedia("(max-width: 768px)");
        setIsMobile(mobileQuery.matches);
    };

    useEffect(() => {
        handleResize();

        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize',handleResize);
    },[])

    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch(`${backend_url}/tasks/get-tasks/${employee_id}/`,{
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            })

            if (!response.ok){
                const errorData = await response.json();
                console.log(errorData['error'])
            }

            const data = await response.json();
            console.log(data);
            setTasksList(data);
            localStorage.setItem('tasklists', data)
        }
        fetchData();
    },[])

    return(
        <div className="task-page-body">
            { taskList ? (
                <div>
                    <Tasks taskList={[taskList]} />
                    <div>
                        {isMobile ? <TaskListPhone taskList={[taskList]}  /> : <TaskList taskList={[taskList]} />}
                    </div>
                </div>
            ): (
                <div className="spinner-grow text-dark" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            ) }
        </div>
    )
}

export default EmpHome;