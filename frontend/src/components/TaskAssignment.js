import React, { useState } from 'react';
import '../styles/formStyle.css';

const TaskAssignment = () => {
  const [task, setTask] = useState('');
  const [employeeId, setEmployeeId] = useState('');

  const handleAssign = (e) => {
    e.preventDefault();
    alert('Task Assigned!');
  };

  return (
    <div className="form-container">
      <h2>Assign Task</h2>
      <form onSubmit={handleAssign}>
        <input
          type="text"
          placeholder="Task Description"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Employee ID"
          value={employeeId}
          onChange={(e) => setEmployeeId(e.target.value)}
          required
        />
        <button type="submit">Assign Task</button>
      </form>
    </div>
  );
};

export default TaskAssignment;
