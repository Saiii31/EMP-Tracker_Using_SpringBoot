package com.myproject.em_project.service;

import com.myproject.em_project.dto.EmployeeDTO;
import com.myproject.em_project.entity.EmployeeEntity;
import com.myproject.em_project.repository.EmployeeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EmployeeServiceImplNew {

    private final EmployeeRepository employeeRepository;

    public List<EmployeeDTO> getAllEmployees() {
        return employeeRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public EmployeeDTO getEmployeeById(Long id) {
        EmployeeEntity employee = employeeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Employee not found with id: " + id));
        return convertToDTO(employee);
    }

    @Transactional
    public EmployeeDTO createEmployee(EmployeeDTO employeeDTO) {
        EmployeeEntity employee = convertToEntity(employeeDTO);
        EmployeeEntity savedEmployee = employeeRepository.save(employee);
        return convertToDTO(savedEmployee);
    }

    @Transactional
    public EmployeeDTO updateEmployee(Long id, EmployeeDTO employeeDTO) {
        EmployeeEntity existingEmployee = employeeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Employee not found with id: " + id));

        existingEmployee.setName(employeeDTO.getName());
        existingEmployee.setEmail(employeeDTO.getEmail());
        existingEmployee.setPhone(employeeDTO.getPhone());
        existingEmployee.setEmployeeId(employeeDTO.getEmployeeId());
        existingEmployee.setDepartment(employeeDTO.getDepartment());
        existingEmployee.setDesignation(employeeDTO.getDesignation());
        existingEmployee.setSalary(employeeDTO.getSalary());
        existingEmployee.setJoinDate(employeeDTO.getJoinDate());
        existingEmployee.setAddress(employeeDTO.getAddress());
        existingEmployee.setCity(employeeDTO.getCity());
        existingEmployee.setState(employeeDTO.getState());
        existingEmployee.setPostalCode(employeeDTO.getPostalCode());
        existingEmployee.setProfileImageUrl(employeeDTO.getProfileImageUrl());
        existingEmployee.setManagerId(employeeDTO.getManagerId());

        EmployeeEntity updatedEmployee = employeeRepository.save(existingEmployee);
        return convertToDTO(updatedEmployee);
    }

    @Transactional
    public void deleteEmployee(Long id) {
        EmployeeEntity employee = employeeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Employee not found with id: " + id));
        employeeRepository.delete(employee);
    }

    private EmployeeDTO convertToDTO(EmployeeEntity employee) {
        EmployeeDTO dto = new EmployeeDTO();
        dto.setId(employee.getId());
        dto.setName(employee.getName());
        dto.setEmail(employee.getEmail());
        dto.setPhone(employee.getPhone());
        dto.setEmployeeId(employee.getEmployeeId());
        dto.setDepartment(employee.getDepartment());
        dto.setDesignation(employee.getDesignation());
        dto.setSalary(employee.getSalary());
        dto.setJoinDate(employee.getJoinDate());
        dto.setAddress(employee.getAddress());
        dto.setCity(employee.getCity());
        dto.setState(employee.getState());
        dto.setPostalCode(employee.getPostalCode());
        dto.setProfileImageUrl(employee.getProfileImageUrl());
        dto.setManagerId(employee.getManagerId());
        return dto;
    }

    private EmployeeEntity convertToEntity(EmployeeDTO dto) {
        EmployeeEntity employee = new EmployeeEntity();
        employee.setName(dto.getName());
        employee.setEmail(dto.getEmail());
        employee.setPhone(dto.getPhone());
        employee.setEmployeeId(dto.getEmployeeId());
        employee.setDepartment(dto.getDepartment());
        employee.setDesignation(dto.getDesignation());
        employee.setSalary(dto.getSalary());
        employee.setJoinDate(dto.getJoinDate());
        employee.setAddress(dto.getAddress());
        employee.setCity(dto.getCity());
        employee.setState(dto.getState());
        employee.setPostalCode(dto.getPostalCode());
        employee.setProfileImageUrl(dto.getProfileImageUrl());
        employee.setManagerId(dto.getManagerId());
        return employee;
    }
}
