package com.myproject.em_project.controller;

import com.myproject.em_project.entity.Notification;
import com.myproject.em_project.service.AuthService;
import com.myproject.em_project.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class NotificationController {

    private final NotificationService notificationService;
    private final AuthService authService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'HR', 'EMPLOYEE')")
    public ResponseEntity<List<Notification>> getMyNotifications() {
        Long currentUserId = authService.getCurrentUser().getId();
        return ResponseEntity.ok(notificationService.getNotificationsByUser(currentUserId));
    }

    @GetMapping("/unread")
    @PreAuthorize("hasAnyRole('ADMIN', 'HR', 'EMPLOYEE')")
    public ResponseEntity<List<Notification>> getUnreadNotifications() {
        Long currentUserId = authService.getCurrentUser().getId();
        return ResponseEntity.ok(notificationService.getUnreadNotifications(currentUserId));
    }

    @GetMapping("/count")
    @PreAuthorize("hasAnyRole('ADMIN', 'HR', 'EMPLOYEE')")
    public ResponseEntity<Long> getUnreadCount() {
        Long currentUserId = authService.getCurrentUser().getId();
        return ResponseEntity.ok(notificationService.getUnreadCount(currentUserId));
    }

    @PutMapping("/{id}/read")
    @PreAuthorize("hasAnyRole('ADMIN', 'HR', 'EMPLOYEE')")
    public ResponseEntity<Notification> markAsRead(@PathVariable Long id) {
        return ResponseEntity.ok(notificationService.markAsRead(id));
    }

    @PutMapping("/read-all")
    @PreAuthorize("hasAnyRole('ADMIN', 'HR', 'EMPLOYEE')")
    public ResponseEntity<String> markAllAsRead() {
        Long currentUserId = authService.getCurrentUser().getId();
        notificationService.markAllAsRead(currentUserId);
        return ResponseEntity.ok("All notifications marked as read");
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'HR', 'EMPLOYEE')")
    public ResponseEntity<String> deleteNotification(@PathVariable Long id) {
        notificationService.deleteNotification(id);
        return ResponseEntity.ok("Notification deleted successfully");
    }
}
