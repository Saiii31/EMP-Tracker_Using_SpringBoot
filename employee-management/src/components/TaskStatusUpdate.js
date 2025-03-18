import React, { useState } from 'react';
import '../styles/formStyle.css';

const TaskStatusUpdate = () => {
  const [status, setStatus] = useState('');

  const handleUpdate = (e) => {
    e.preventDefault();
    alert('Task Status Updated!');
  };

  return (
    <div className="form-container">
      <h2>Update Task Status</h2>
      <form onSubmit={handleUpdate}>
        <input
          type="text"
          placeholder="Task Status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          required
        />
        <button type="submit">Update Status</button>
      </form>
    </div>
  );
};

export default TaskStatusUpdate;
