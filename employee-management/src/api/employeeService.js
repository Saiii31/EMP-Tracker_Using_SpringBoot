import axios from "./axios";

export const getEmployees = async () => {
    const response = await axios.get("/employees");
    return response.data;
};

export const createEmployee = async (employee) => {
    const response = await axios.post("/employees", employee);
    return response.data;
};

export const updateEmployee = async (id, employee) => {
    const response = await axios.put(`/employees/${id}`, employee);
    return response.data;
};

export const deleteEmployee = async (id) => {
    const response = await axios.delete(`/employees/${id}`);
    return response.data;
};

export const getEmployeeById = async (id) => {
    try {
      const response = await fetch(`/api/employees/${id}`);
      if (!response.ok) {
        throw new Error('Employee not found');
      }
      return await response.json();
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  export async function getLoggedInEmployee() {
    const response = await axios.get("/employee/me"); // API endpoint for the logged-in employee's data
    return response.data;
}

  