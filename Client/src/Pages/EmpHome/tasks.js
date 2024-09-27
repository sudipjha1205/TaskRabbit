import React, { useState, useEffect } from "react";
import './tasks.css';
import bell from "../../Assets/Icons/notification-bell.png";
import user_logo from "../../Assets/Icons/user.png";

const possibleStatuses = ['todo', 'in dev', 'in qa', 'dev qa', 'qa approved', 'dev qa approved']; // List all possible statuses

const Tasks = (props) => {
    const [allTasks, setAllTasks] = useState([]);
    const [currentDateTime, setCurrentDateTime] = useState(new Date());
    const [statusCounts, setStatusCounts] = useState(() => {
        // Initialize status counts with zero for each possible status
        return possibleStatuses.reduce((acc, status) => {
            acc[status] = 0;
            return acc;
        }, {});
    });

    const userDetails = JSON.parse(sessionStorage.getItem('user'));
    const employee_id = userDetails?.user?.username || '';
    const first_name = userDetails?.user?.first_name || '';
    const last_name = userDetails?.user?.last_name || '';
    const full_name = `${first_name} ${last_name}`;

    const countStatuses = (tasks) => {
        if (!Array.isArray(tasks)) {
            console.error('Tasks is not an array:', tasks);
            return {};
        }

        const counts = possibleStatuses.reduce((acc, status) => {
            acc[status] = 0; // Initialize counts for each status
            return acc;
        }, {});

        // Use a Set to track unique task IDs
        const uniqueTaskIds = new Set();

        tasks.forEach(task => {
            if (task.status) {
                const status = task.status.trim().toLowerCase(); // Normalize status
                if (possibleStatuses.includes(status)) {
                    if (!uniqueTaskIds.has(task.task_id)) {
                        counts[status] += 1; // Increment the count for the status
                        uniqueTaskIds.add(task.task_id); // Add task ID to the set
                    }
                } else {
                    console.warn('Unexpected status:', status);
                }
            } else {
                console.warn('Task without status:', task);
            }
        });

        console.log('Counts:', counts); // Verify the counts
        return counts;
    };

    useEffect(() => {
        const taskList = Array.isArray(props.taskList) && props.taskList.length > 0 ? props.taskList[0].all_tasks : [];
        console.log('Updating allTasks:', taskList); // Verify the task list
        setAllTasks(taskList);
    }, [props.taskList]);

    useEffect(() => {
        if (allTasks.length === 0) {
            console.log('No tasks available');
        } else {
            const counts = countStatuses(allTasks);
            setStatusCounts(counts);
        }
    }, [allTasks]);

    useEffect(() => {
        const updateDateTime = () => {
            setCurrentDateTime(new Date());
        };
        const intervalId = setInterval(updateDateTime, 1000);
        return () => clearInterval(intervalId);
    }, []);

    const formatDate = (date) => {
        const day = date.getDate();
        const month = date.toLocaleString('default', { month: 'short' });
        const weekday = date.toLocaleString('default', { weekday: 'long' });

        return `${day} ${month}, ${weekday}`;
    };

    return (
        <div className="tasks-body">
            <div className="task-header">
                <div className="left-section">
                    <div className="task-greeting">
                        Hello {first_name}
                    </div>
                    <div className="task-welcome">
                        Welcome to your task management system
                    </div>
                </div>
                <div className="right-section">
                    <p className="date">{formatDate(currentDateTime)}</p>
                    <img src={bell} alt="notification..." height="25px" className="notifications"/>
                    <img src={user_logo} alt="User profile..." height="25px" className="user-profile"/>
                </div>
            </div>
            <div className="task-unit">
                <div className="analytics-header">
                    Analytics Overview
                </div>
                <div className="analytics-overview">
                    {possibleStatuses.map(status => (
                        <div
                            key={status}
                            className={`analytics-box ${getBoxClass(status)}`}>
                            <p className="metric-title">{status.toUpperCase()}</p>
                            <p className="metric-value">{statusCounts[status]}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const getBoxClass = (status) => {
    switch (status) {
        case 'todo':
            return 'green-box';
        case 'in dev':
            return 'orange-box';
        case 'in qa':
            return 'purple-box';
        case 'dev qa':
        case 'qa approved':
        case 'dev qa approved':
            return 'red-box';
        default:
            return 'default-box';
    }
};

export default Tasks;
