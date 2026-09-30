package com.myproject.em_project.service;

import com.myproject.em_project.entity.AuditLog;
import com.myproject.em_project.entity.Tenant;
import com.myproject.em_project.entity.User;
import com.myproject.em_project.enums.Role;
import com.myproject.em_project.repository.AuditLogRepository;
import jakarta.servlet.http.HttpServletRequest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuditLogServiceTest {

    @Mock
    private AuditLogRepository auditLogRepository;

    @Mock
    private HttpServletRequest request;

    @InjectMocks
    private AuditLogService auditLogService;

    private User user;
    private Tenant tenant;

    @BeforeEach
    void setUp() {
        user = new User();
        user.setId(1L);
        user.setUsername("testuser");
        user.setEmail("test@example.com");
        user.setRole(Role.EMPLOYEE);

        tenant = new Tenant();
        tenant.setId(1L);
        tenant.setTenantCode("TEST");
        tenant.setTenantName("Test Organization");
    }

    @Test
    void testLogAction_Success() {
        when(request.getHeader("X-Forwarded-For")).thenReturn("192.168.1.1");
        when(request.getHeader("User-Agent")).thenReturn("Mozilla/5.0");
        when(auditLogRepository.save(any(AuditLog.class))).thenAnswer(invocation -> invocation.getArgument(0));

        auditLogService.logAction(user, "CREATE", "Employee", 1L, "Created new employee", request);

        verify(auditLogRepository, times(1)).save(any(AuditLog.class));
    }

    @Test
    void testLogActionWithTenant_Success() {
        when(request.getHeader("X-Forwarded-For")).thenReturn("192.168.1.1");
        when(request.getHeader("User-Agent")).thenReturn("Mozilla/5.0");
        when(auditLogRepository.save(any(AuditLog.class))).thenAnswer(invocation -> invocation.getArgument(0));

        auditLogService.logActionWithTenant(user, tenant, "CREATE", "Employee", 1L, "Created new employee", request);

        verify(auditLogRepository, times(1)).save(any(AuditLog.class));
    }

    @Test
    void testGetUserAuditLogs_Success() {
        AuditLog log1 = new AuditLog();
        log1.setId(1L);
        log1.setUser(user);
        log1.setAction("CREATE");

        AuditLog log2 = new AuditLog();
        log2.setId(2L);
        log2.setUser(user);
        log2.setAction("UPDATE");

        when(auditLogRepository.findByUserOrderByCreatedAtDesc(user)).thenReturn(Arrays.asList(log1, log2));

        List<AuditLog> result = auditLogService.getUserAuditLogs(user);

        assertEquals(2, result.size());
        verify(auditLogRepository, times(1)).findByUserOrderByCreatedAtDesc(user);
    }

    @Test
    void testGetAuditLogsByDateRange_Success() {
        LocalDateTime startDate = LocalDateTime.now().minusDays(7);
        LocalDateTime endDate = LocalDateTime.now();

        when(auditLogRepository.findByCreatedAtBetween(startDate, endDate)).thenReturn(Arrays.asList());

        List<AuditLog> result = auditLogService.getAuditLogsByDateRange(startDate, endDate);

        assertNotNull(result);
        verify(auditLogRepository, times(1)).findByCreatedAtBetween(startDate, endDate);
    }

    @Test
    void testGetTenantAuditLogs_Success() {
        when(auditLogRepository.findByTenantId(1L)).thenReturn(Arrays.asList());

        List<AuditLog> result = auditLogService.getTenantAuditLogs(1L);

        assertNotNull(result);
        verify(auditLogRepository, times(1)).findByTenantId(1L);
    }

    @Test
    void testGetClientIpAddress_XForwardedFor() {
        when(request.getHeader("X-Forwarded-For")).thenReturn("192.168.1.1");

        String ipAddress = auditLogService.getClientIpAddress(request);

        assertEquals("192.168.1.1", ipAddress);
    }

    @Test
    void testGetClientIpAddress_RemoteAddr() {
        when(request.getHeader("X-Forwarded-For")).thenReturn(null);
        when(request.getRemoteAddr()).thenReturn("127.0.0.1");

        String ipAddress = auditLogService.getClientIpAddress(request);

        assertEquals("127.0.0.1", ipAddress);
    }
}
