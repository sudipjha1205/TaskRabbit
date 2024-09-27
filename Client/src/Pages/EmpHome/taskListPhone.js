import React, { useState, useEffect } from "react";

import './taskListPhone.css'

const TaskListPhone = ({ taskList }) => {
    const lorem = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."



    function TruncatedText(text, maxLength) {
        if (text.length > maxLength){
            return text.substring(0,maxLength) + "...";
        }
        return text;
    }

    return(
        <div>
            <p className="tasks-list-header">Tasks List</p>
            <div>
                <table>
                    <thead>
                        <tr>
                            <th scope="col">ID</th>
                            <th scope="col">Ticket Title</th>
                        </tr>
                    </thead>
                    <tbody className="task-list-phone-tbody">
                        {taskList && taskList[0]?.all_tasks.map((task, index) => (
                            <tr key={task.task_id || index}>
                                <td style={{ width: '50px'}}>{TruncatedText(task.task_id,10)}</td>
                                <td>{TruncatedText(lorem,30)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div> 
        </div>
    )
}

export default TaskListPhone;