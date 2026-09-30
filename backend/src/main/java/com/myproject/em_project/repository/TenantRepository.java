package com.myproject.em_project.repository;

import com.myproject.em_project.entity.Tenant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TenantRepository extends JpaRepository<Tenant, Long> {
    Optional<Tenant> findByTenantCode(String tenantCode);
    Optional<Tenant> findByDomain(String domain);
    boolean existsByTenantCode(String tenantCode);
    boolean existsByDomain(String domain);
}
