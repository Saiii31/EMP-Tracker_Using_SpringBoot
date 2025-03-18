import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getLoggedInEmployee } from "../api/employeeService";
import { toast } from "react-toastify";

function EmployeeProfile() {
    const [employee, setEmployee] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchEmployeeData() {
            try {
                const data = await getLoggedInEmployee(); // Fetch data for the logged-in employee
                setEmployee(data);
            } catch (error) {
                toast.error("Failed to fetch your profile data.");
            } finally {
                setLoading(false);
            }
        }
        fetchEmployeeData();
    }, []);

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <h1>My Profile</h1>
            {employee ? (
                <div>
                    <p><strong>Name:</strong> {employee.name}</p>
                    <p><strong>Email:</strong> {employee.email}</p>
                    <p><strong>Phone:</strong> {employee.phone}</p>
                    <button onClick={() => navigate(`/edit/${employee.id}`)} className="edit-button">
                        Edit My Info
                    </button>
                </div>
            ) : (
                <p>No data available</p>
            )}
        </div>
    );
}

export default EmployeeProfile;
