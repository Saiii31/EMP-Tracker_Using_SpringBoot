import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getEmployeeById, updateEmployee } from '../api/employeeService';  // Make sure to import updateEmployee

const EditEmployee = () => {
  const { id } = useParams();  // Get the employee ID from the URL
  const [employee, setEmployee] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const data = await getEmployeeById(id);  // Fetch employee by ID
        setEmployee(data);
      } catch (error) {
        console.error("Error fetching employee:", error);
      }
    };

    fetchEmployee();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Call updateEmployee to save the updated employee data
      const updatedEmployee = await updateEmployee(id, employee);
      console.log('Employee updated successfully:', updatedEmployee);

      // Redirect back to employee list or another page after successful update
      navigate('/employee-list');
    } catch (error) {
      console.error("Failed to update employee:", error);
    }
  };

  if (!employee) return <div>Loading...</div>;

  return (
    <div>
      <h1>Edit Employee</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name</label>
          <input
            type="text"
            value={employee.name}
            onChange={(e) => setEmployee({ ...employee, name: e.target.value })}
          />
        </div>
        <div>
          <label>Email</label>
          <input
            type="email"
            value={employee.email}
            onChange={(e) => setEmployee({ ...employee, email: e.target.value })}
          />
        </div>
        <div>
          <label>Phone</label>
          <input
            type="text"
            value={employee.phone}
            onChange={(e) => setEmployee({ ...employee, phone: e.target.value })}
          />
        </div>
        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
};

export default EditEmployee;
