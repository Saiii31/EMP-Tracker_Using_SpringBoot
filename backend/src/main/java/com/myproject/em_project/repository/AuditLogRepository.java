package com.myproject.em_project.repository;

import com.myproject.em_project.entity.AuditLog;
import com.myproject.em_project.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {

    List<AuditLog> findByUser(User user);

    List<AuditLog> findByUserOrderByCreatedAtDesc(User user);

    List<AuditLog> findByAction(String action);

    List<AuditLog> findByEntity(String entity);

    List<AuditLog> findByCreatedAtBetween(LocalDateTime startDate, LocalDateTime endDate);

    @Query("SELECT a FROM AuditLog a WHERE a.user = :user AND a.createdAt BETWEEN :startDate AND :endDate ORDER BY a.createdAt DESC")
    List<AuditLog> findByUserAndDateRange(@Param("user") User user, @Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);

    @Query("SELECT a FROM AuditLog a WHERE a.tenant.id = :tenantId ORDER BY a.createdAt DESC")
    List<AuditLog> findByTenantId(@Param("tenantId") Long tenantId);

    List<AuditLog> findAllByOrderByChangedAtDesc();

    List<AuditLog> findByEntityNameOrderByChangedAtDesc(String entityName);

    List<AuditLog> findByChangedByEmailOrderByChangedAtDesc(String email);
}
