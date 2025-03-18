package com.myproject.em_project.controller;

import org.springframework.web.bind.annotation.RestController;

import com.myproject.em_project.model.Employee;
import com.myproject.em_project.services.EmployeeService;

// import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
// import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PutMapping;


@CrossOrigin("http://localhost:3000")

@RestController
public class EmpController {

    
    // EmployeeService employeeServices=new EmployeeServiceImpl();

    //Dependency Injection (By using IOC container object is created to reduce memory allocation)
    @Autowired
    EmployeeService employeeServices;//good practice is by injecting the dependecies in constructor itself

    @GetMapping("employees/{id}")
    public Employee getEmployeeById(@PathVariable Long id) {
        return employeeServices.readEmployee(id);
    }

    @GetMapping("employees")
    public List<Employee> getAllEmployees() {
        return employeeServices.readEmployees();
    }
    
    @PostMapping("employees")
    public String createEmployee(@RequestBody Employee employee) {
        return employeeServices.createEmployee(employee);
    }

//     @DeleteMapping("employees/{id}")
//     public String deleteEmployee(@PathVariable Long id){
//     employeeServices.deleteEmployee(id);
//     if(employeeServices.deleteEmployee(id))
//         return "Delete Successfully";
//     return "Not Found"; 
//   }


@DeleteMapping("employees/{id}")
public ResponseEntity<String> deleteEmployee(@PathVariable Long id) {
    String response = employeeServices.deleteEmployee(id);
    if (response.contains("not found")) {
        return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
    }
    return new ResponseEntity<>(response, HttpStatus.OK);
}

    

    @PutMapping("employees/{id}")
    public String updateEmployee(@PathVariable Long id, @RequestBody Employee employee) {
     return employeeServices.updateEmployee(id, employee);

    }
}
