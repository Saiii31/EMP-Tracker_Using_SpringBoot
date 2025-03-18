import React, { useEffect, useState } from "react";
import { getEmployees, deleteEmployee } from "../api/employeeService";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa'; // Importing icons
import "react-toastify/dist/ReactToastify.css";
import '../styles/employeeList.css';


function EmployeeList() {
    const [employees, setEmployees] = useState([]);
    const [loadingStates, setLoadingStates] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchData() {
            try {
                const data = await getEmployees();
                setEmployees(data);
            } catch (error) {
                toast.error("Failed to fetch employees. Please try again later.");
            }
        }
        fetchData();
    }, []);

    const handleDelete = async (id) => {
        setLoadingStates((prevState) => ({ ...prevState, [id]: true }));
        try {
            await deleteEmployee(id);
            setEmployees((prevEmployees) => prevEmployees.filter((emp) => emp.id !== id));
            toast.success("Employee deleted successfully.");
        } catch (error) {
            if (error.response?.status === 404) {
                toast.error(`Employee with ID ${id} not found.`);
            } else if (error.response?.status === 405) {
                toast.error("Method not allowed. Please check the server.");
            } else {
                toast.error("An unexpected error occurred.");
            }
        } finally {
            setLoadingStates((prevState) => ({ ...prevState, [id]: false }));
        }
    };

    return (
        <div>
            <h1>Employee List</h1>
            <button onClick={() => navigate("/add")} className="add-button">
                                 <FaPlus /> Add Employee</button>
            <table>
                <thead>
                    <tr>
                        <th>Id</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {employees.map((emp) => (
                        <tr key={emp.id}>
                            <td>{emp.id}</td>
                            <td>{emp.name}</td>
                            <td>{emp.email}</td>
                            <td>{emp.phone}</td>
                            <td className="btnalign"> 
                                 <button onClick={() => navigate(`/edit/${emp.id}`)} className="edit-button"><FaEdit/>Edit</button>
                                <button
                                onClick={() => handleDelete(emp.id)}
                                disabled={loadingStates[emp.id] || false}
                                className="delete-button">
                                    {loadingStates[emp.id] ? "Deleting..." : <><FaTrash /> Delete</>}
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default EmployeeList;
