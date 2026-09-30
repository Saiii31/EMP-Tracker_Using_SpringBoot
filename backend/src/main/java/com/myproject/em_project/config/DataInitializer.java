package com.myproject.em_project.config;

import com.myproject.em_project.entity.Tenant;
import com.myproject.em_project.entity.User;
import com.myproject.em_project.enums.Role;
import com.myproject.em_project.repository.TenantRepository;
import com.myproject.em_project.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final TenantRepository tenantRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        // Create default tenant
        Tenant defaultTenant = tenantRepository.findByTenantCode("DEFAULT")
                .orElseGet(() -> {
                    Tenant tenant = new Tenant();
                    tenant.setTenantCode("DEFAULT");
                    tenant.setTenantName("Default Organization");
                    tenant.setDomain("default.com");
                    tenant.setActive(true);
                    return tenantRepository.save(tenant);
                });

        // Commented out - users should register themselves instead of using fixed credentials
        // if (!userRepository.existsByUsername("admin")) {
        //     User admin = new User();
        //     admin.setUsername("admin");
        //     admin.setPassword(passwordEncoder.encode("admin123"));
        //     admin.setEmail("admin@ems.com");
        //     admin.setRole(Role.ADMIN);
        //     admin.setEnabled(true);
        //     admin.setTenant(defaultTenant);
        //     userRepository.save(admin);
        //     System.out.println("Default admin user created with username: admin and password: admin123");
        // }
        //
        // if (!userRepository.existsByUsername("hr")) {
        //     User hr = new User();
        //     hr.setUsername("hr");
        //     hr.setPassword(passwordEncoder.encode("hr123"));
        //     hr.setEmail("hr@ems.com");
        //     hr.setRole(Role.HR);
        //     hr.setEnabled(true);
        //     hr.setTenant(defaultTenant);
        //     userRepository.save(hr);
        //     System.out.println("Default HR user created with username: hr and password: hr123");
        // }
        //
        // if (!userRepository.existsByUsername("employee")) {
        //     User employee = new User();
        //     employee.setUsername("employee");
        //     employee.setPassword(passwordEncoder.encode("employee123"));
        //     employee.setEmail("employee@ems.com");
        //     employee.setRole(Role.EMPLOYEE);
        //     employee.setEnabled(true);
        //     employee.setTenant(defaultTenant);
        //     userRepository.save(employee);
        //     System.out.println("Default employee user created with username: employee and password: employee123");
        // }

        System.out.println("DataInitializer: Default tenant created. Users should register themselves via the registration form.");
    }
}
