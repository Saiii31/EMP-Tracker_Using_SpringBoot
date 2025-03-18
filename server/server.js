const express = require('express');
const bcrypt = require('bcryptjs');
const cors = require('cors');  // Import CORS for handling cross-origin requests
const app = express();
const port = 5000;

// Enable CORS
app.use(cors());
app.use(express.json());

// Dummy employee database (replace with actual DB in production)
let employees = [
  { email: 'employee1@example.com', employeeId: 'emp123' },
  { email: 'employee2@example.com', employeeId: 'emp124' },
  // Other employees...
];

// Common password for all employees
const commonPasswordHash = bcrypt.hashSync('commonPassword123', 10);

// Route to authenticate employee by email
app.post('/api/employee/login', (req, res) => {
  const { email, password } = req.body;

  // Find employee by email
  const employee = employees.find(emp => emp.email === email);

  // Check if employee exists and password matches the common password
  if (employee && bcrypt.compareSync(password, commonPasswordHash)) {
    return res.json({ success: true, employeeId: employee.employeeId });
  }

  return res.status(400).json({ success: false, message: 'Invalid login credentials' });
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
