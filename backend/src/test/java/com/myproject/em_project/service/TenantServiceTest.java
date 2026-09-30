package com.myproject.em_project.service;

import com.myproject.em_project.entity.Tenant;
import com.myproject.em_project.repository.TenantRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TenantServiceTest {

    @Mock
    private TenantRepository tenantRepository;

    @InjectMocks
    private TenantService tenantService;

    private Tenant tenant;

    @BeforeEach
    void setUp() {
        tenant = new Tenant();
        tenant.setId(1L);
        tenant.setTenantCode("TEST");
        tenant.setTenantName("Test Organization");
        tenant.setDomain("test.com");
        tenant.setActive(true);
    }

    @Test
    void testCreateTenant_Success() {
        when(tenantRepository.existsByTenantCode("TEST")).thenReturn(false);
        when(tenantRepository.existsByDomain("test.com")).thenReturn(false);
        when(tenantRepository.save(any(Tenant.class))).thenReturn(tenant);

        Tenant result = tenantService.createTenant(tenant);

        assertNotNull(result);
        assertEquals("TEST", result.getTenantCode());
        verify(tenantRepository, times(1)).save(any(Tenant.class));
    }

    @Test
    void testCreateTenant_TenantCodeExists() {
        when(tenantRepository.existsByTenantCode("TEST")).thenReturn(true);

        assertThrows(RuntimeException.class, () -> tenantService.createTenant(tenant));
        verify(tenantRepository, never()).save(any(Tenant.class));
    }

    @Test
    void testCreateTenant_DomainExists() {
        when(tenantRepository.existsByTenantCode("TEST")).thenReturn(false);
        when(tenantRepository.existsByDomain("test.com")).thenReturn(true);

        assertThrows(RuntimeException.class, () -> tenantService.createTenant(tenant));
        verify(tenantRepository, never()).save(any(Tenant.class));
    }

    @Test
    void testGetTenantByCode_Success() {
        when(tenantRepository.findByTenantCode("TEST")).thenReturn(Optional.of(tenant));

        Optional<Tenant> result = tenantService.getTenantByCode("TEST");

        assertTrue(result.isPresent());
        assertEquals("TEST", result.get().getTenantCode());
        verify(tenantRepository, times(1)).findByTenantCode("TEST");
    }

    @Test
    void testGetTenantByCode_NotFound() {
        when(tenantRepository.findByTenantCode("NONEXISTENT")).thenReturn(Optional.empty());

        Optional<Tenant> result = tenantService.getTenantByCode("NONEXISTENT");

        assertFalse(result.isPresent());
        verify(tenantRepository, times(1)).findByTenantCode("NONEXISTENT");
    }

    @Test
    void testUpdateTenant_Success() {
        when(tenantRepository.findById(1L)).thenReturn(Optional.of(tenant));
        when(tenantRepository.save(any(Tenant.class))).thenReturn(tenant);

        Tenant updatedTenant = new Tenant();
        updatedTenant.setTenantName("Updated Organization");
        updatedTenant.setDomain("updated.com");
        updatedTenant.setActive(false);

        Tenant result = tenantService.updateTenant(1L, updatedTenant);

        assertNotNull(result);
        assertEquals("Updated Organization", result.getTenantName());
        verify(tenantRepository, times(1)).save(any(Tenant.class));
    }

    @Test
    void testUpdateTenant_NotFound() {
        when(tenantRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> tenantService.updateTenant(1L, tenant));
        verify(tenantRepository, never()).save(any(Tenant.class));
    }

    @Test
    void testDeleteTenant_Success() {
        doNothing().when(tenantRepository).deleteById(1L);

        tenantService.deleteTenant(1L);

        verify(tenantRepository, times(1)).deleteById(1L);
    }
}
