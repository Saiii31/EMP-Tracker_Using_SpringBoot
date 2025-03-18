package com.myproject.em_project.model;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor

//model with 3 things
public class Employee {
    private Long id;
    private String name;
    private String phone;
    private String email;
}
