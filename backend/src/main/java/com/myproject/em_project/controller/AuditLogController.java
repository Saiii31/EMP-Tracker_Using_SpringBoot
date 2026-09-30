package com.myproject.em_project.controller;

import com.myproject.em_project.entity.AuditLog;
import com.myproject.em_project.repository.AuditLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/audit-logs")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class AuditLogController {

    private final AuditLogRepository auditLogRepository;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<AuditLog>> getAllAuditLogs() {
        return ResponseEntity.ok(auditLogRepository.findAllByOrderByChangedAtDesc());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<AuditLog> getAuditLogById(@PathVariable Long id) {
        return ResponseEntity.ok(auditLogRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Audit log not found")));
    }

    @GetMapping("/entity/{entityName}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<AuditLog>> getAuditLogsByEntity(@PathVariable String entityName) {
        return ResponseEntity.ok(auditLogRepository.findByEntityNameOrderByChangedAtDesc(entityName));
    }

    @GetMapping("/user/{email}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<AuditLog>> getAuditLogsByUser(@PathVariable String email) {
        return ResponseEntity.ok(auditLogRepository.findByChangedByEmailOrderByChangedAtDesc(email));
    }
}
