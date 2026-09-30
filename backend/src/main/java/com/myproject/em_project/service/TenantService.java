package com.myproject.em_project.service;

import com.myproject.em_project.entity.Tenant;
import com.myproject.em_project.repository.TenantRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class TenantService {

    private final TenantRepository tenantRepository;

    @Transactional(readOnly = true)
    public List<Tenant> getAllTenants() {
        return tenantRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Optional<Tenant> getTenantById(Long id) {
        return tenantRepository.findById(id);
    }

    @Transactional(readOnly = true)
    public Optional<Tenant> getTenantByCode(String tenantCode) {
        return tenantRepository.findByTenantCode(tenantCode);
    }

    @Transactional(readOnly = true)
    public Optional<Tenant> getTenantByDomain(String domain) {
        return tenantRepository.findByDomain(domain);
    }

    @Transactional
    public Tenant createTenant(Tenant tenant) {
        if (tenantRepository.existsByTenantCode(tenant.getTenantCode())) {
            throw new RuntimeException("Tenant code already exists");
        }
        if (tenantRepository.existsByDomain(tenant.getDomain())) {
            throw new RuntimeException("Domain already exists");
        }
        return tenantRepository.save(tenant);
    }

    @Transactional
    public Tenant updateTenant(Long id, Tenant tenant) {
        Tenant existingTenant = tenantRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Tenant not found"));

        existingTenant.setTenantName(tenant.getTenantName());
        existingTenant.setDomain(tenant.getDomain());
        existingTenant.setActive(tenant.getActive());

        return tenantRepository.save(existingTenant);
    }

    @Transactional
    public void deleteTenant(Long id) {
        tenantRepository.deleteById(id);
    }
}
