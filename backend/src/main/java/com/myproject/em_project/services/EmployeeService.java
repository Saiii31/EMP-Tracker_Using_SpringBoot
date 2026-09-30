package com.myproject.em_project.services;

import java.util.List;

import com.myproject.em_project.model.Employee;

public interface EmployeeService {
    String createEmployee(Employee employee);
    List<Employee> readEmployees();
    String deleteEmployee(Long id);
    String updateEmployee(Long id,Employee employee);
    Employee readEmployee(Long id);

    
}
