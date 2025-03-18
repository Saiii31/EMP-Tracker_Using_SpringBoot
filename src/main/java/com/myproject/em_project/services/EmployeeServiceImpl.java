package com.myproject.em_project.services;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.myproject.em_project.entity.EmployeeEntity;
import com.myproject.em_project.model.Employee;
import com.myproject.em_project.repository.EmployeeRepository;

@Service
public class EmployeeServiceImpl implements EmployeeService{

    @Autowired
    private EmployeeRepository employeeRepository;
    // List<Employee> employees=new ArrayList<>();

    @Override
    public String createEmployee(Employee employee) {
        EmployeeEntity employeeEntity=new EmployeeEntity();
        BeanUtils.copyProperties(employee, employeeEntity);
        employeeRepository.save(employeeEntity);
    //    employees.add(employee);
       return "Saved Successfully";
    }

    @Override
   public Employee readEmployee(Long id) {
      EmployeeEntity emp=employeeRepository.findById(id).get();
      Employee employee=new Employee();
      BeanUtils.copyProperties(emp, employee);
      return employee;
   }

    @Override
    public List<Employee> readEmployees() {
       List<EmployeeEntity> employeesList=employeeRepository.findAll();
       List<Employee> employees=new ArrayList<>();

       for (EmployeeEntity employeeEntity : employeesList) 
       {
            Employee emp=new Employee();
            emp.setId(employeeEntity.getId());
            emp.setName(employeeEntity.getName());
            emp.setPhone(employeeEntity.getPhone());
            emp.setEmail(employeeEntity.getEmail());
            employees.add(emp);
       }
       return employees;
    }

   //  @Override
   //  public boolean deleteEmployee(Long id) {
   //  //    employees.removeIf(employee -> employee.getId().equals(id));
   //     //removeIf removes elements from the list based on the predicate. 
   //     //and employee.getId().equals(id) matches the id to be deleted.
   //     Optional<EmployeeEntity> empOptional = employeeRepository.findById(id);
   //     if (empOptional.isPresent()) {
   //         employeeRepository.delete(empOptional.get());
   //         return true;
   //     } else {
   //         throw new RuntimeException("Employee not found with id: " + id);
   //     }
   //  }

   @Override
public String deleteEmployee(Long id) {
    Optional<EmployeeEntity> employee = employeeRepository.findById(id);
    
    if (employee.isEmpty()) {
        return "Employee not found with id: " + id;
    }

    employeeRepository.delete(employee.get());
    return "Employee deleted successfully";
}


   @Override
   public String updateEmployee(Long id, Employee employee) {
      EmployeeEntity emp=employeeRepository.findById(id).get();

      emp.setName(employee.getName());
      emp.setPhone(employee.getPhone());
      emp.setEmail(employee.getEmail());

      employeeRepository.save(emp);
      return "Update Successfully";

   }

   

   
    

}
