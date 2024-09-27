import React from "react";
import './taskList.css'; // Add your custom styles here

const TaskList = ({ taskList }) => {
    function DateExtractor(dateString) {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Ensure two digits for the month
        const day = String(date.getDate()).padStart(2, '0'); // Ensure two digits for the day
        
        return `${year}-${month}-${day}`;
    }

    function TruncatedText(text, maxLength) {
        if (text.length > maxLength) {
            return text.substring(0, maxLength) + '...';
        }
        return text;
    }

    return (
        <div className="task-table-container">
            <p className="tasks-list-header">Tasks List</p>
            <table className="table table-borderless">
                <thead>
                    <tr>
                        <th scope="col">Raised On</th>
                        <th scope="col">ID</th>
                        <th scope="col">Ticket Title</th>
                        <th scope="col">Priority</th>
                        <th scope="col">Status</th>
                        <th scope="col">Due Date</th>
                        <th scope="col">Assigned By</th>
                    </tr>
                </thead>
                <tbody>
                    {taskList && taskList[0]?.all_tasks.map((task, index) => (
                        <tr key={task.task_id || index}>
                            <td>{DateExtractor(task.created_at)}</td>
                            <td>{TruncatedText(task.task_id,10)}</td>
                            <td>{TruncatedText(task.summary, 30)}</td>
                            <td>{task.priority}</td>
                            <td>{task.status}</td>
                            <td>{DateExtractor(task.due_date)}</td>
                            <td>{task.assignee}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default TaskList;
