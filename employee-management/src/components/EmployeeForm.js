// import React, { useState, useEffect } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import { createEmployee, updateEmployee, getEmployees } from "../api/employeeService";
// import "../styles/formStyle.css"

// function EmployeeForm() {
//     const [employee, setEmployee] = useState({ name: "", email: "", phone: "" });
//     const navigate = useNavigate();
//     const { id } = useParams();

//     useEffect(() => {
//         if (id) {
//             async function fetchEmployee() {
//                 const employees = await getEmployees();
//                 const emp = employees.find((emp) => emp.id === parseInt(id));
//                 if (emp) setEmployee(emp);
//             }
//             fetchEmployee();
//         }
//     }, [id]);

//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setEmployee({ ...employee, name: value });
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         if (id) {
//             await updateEmployee(id, employee);
//         } else {
//             await createEmployee(employee);
//         }
//         navigate("/");
//     };

//     return (
//         <form onSubmit={handleSubmit}>
//             <div>
//                 <label>Name:</label>
//                 <input name="name" value={employee.name} onChange={handleChange} />
//             </div>
//             <div>
//                 <label>Email:</label>
//                 <input name="email" value={employee.email} onChange={handleChange} />
//             </div>
//             <div>
//                 <label>Phone:</label>
//                 <input name="phone" value={employee.phone} onChange={handleChange} />
//             </div>
//             <button type="submit">{id ? "Update" : "Create"} Employee</button>
//         </form>
//     );
// }

// export default EmployeeForm;

import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createEmployee, updateEmployee, getEmployees } from "../api/employeeService";
import "../styles/formStyle.css";

function EmployeeForm() {
    const [employee, setEmployee] = useState({ name: "", email: "", phone: "" });
    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        if (id) {
            async function fetchEmployee() {
                const employees = await getEmployees();
                const emp = employees.find((emp) => emp.id === parseInt(id));
                if (emp) setEmployee(emp);
            }
            fetchEmployee();
        }
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEmployee({ ...employee, [name]: value }); // Dynamically update the corresponding field
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (id) {
            await updateEmployee(id, employee);
        } else {
            await createEmployee(employee);
        }
        navigate("/list");
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Name:</label>
                <input name="name" value={employee.name} onChange={handleChange} />
            </div>
            <div>
                <label>Email:</label>
                <input name="email" value={employee.email} onChange={handleChange} />
            </div>
            <div>
                <label>Phone:</label>
                <input name="phone" value={employee.phone} onChange={handleChange} />
            </div>
              <button type="submit">{id ? "Update" : "Create"} Employee</button> 
        </form>
    );
}

export default EmployeeForm;
