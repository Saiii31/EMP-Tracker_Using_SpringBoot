package com.myproject.em_project.service;

import com.myproject.em_project.entity.Notification;
import com.myproject.em_project.entity.User;
import com.myproject.em_project.enums.Role;
import com.myproject.em_project.repository.NotificationRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class NotificationServiceTest {

    @Mock
    private NotificationRepository notificationRepository;

    @InjectMocks
    private NotificationService notificationService;

    private User user;

    @BeforeEach
    void setUp() {
        user = new User();
        user.setId(1L);
        user.setUsername("testuser");
        user.setEmail("test@example.com");
        user.setRole(Role.EMPLOYEE);
    }

    @Test
    void testCreateNotification_Success() {
        Notification notification = new Notification();
        notification.setId(1L);
        notification.setUser(user);
        notification.setTitle("Test Notification");
        notification.setMessage("Test message");
        notification.setType("INFO");

        when(notificationRepository.save(any(Notification.class))).thenReturn(notification);

        Notification result = notificationService.createNotification(user, "Test Notification", "Test message", "INFO", "/test");

        assertNotNull(result);
        assertEquals("Test Notification", result.getTitle());
        verify(notificationRepository, times(1)).save(any(Notification.class));
    }

    @Test
    void testMarkAsRead_Success() {
        Notification notification = new Notification();
        notification.setId(1L);
        notification.setUser(user);
        notification.setRead(false);

        when(notificationRepository.findById(1L)).thenReturn(Optional.of(notification));
        when(notificationRepository.save(any(Notification.class))).thenReturn(notification);

        notificationService.markAsRead(1L);

        assertTrue(notification.getRead());
        assertNotNull(notification.getReadAt());
        verify(notificationRepository, times(1)).save(any(Notification.class));
    }

    @Test
    void testMarkAsRead_NotFound() {
        when(notificationRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> notificationService.markAsRead(1L));
        verify(notificationRepository, never()).save(any(Notification.class));
    }

    @Test
    void testMarkAllAsRead_Success() {
        Notification notification1 = new Notification();
        notification1.setId(1L);
        notification1.setUser(user);
        notification1.setRead(false);

        Notification notification2 = new Notification();
        notification2.setId(2L);
        notification2.setUser(user);
        notification2.setRead(false);

        when(notificationRepository.findByUserAndReadFalseOrderByCreatedAtDesc(user)).thenReturn(Arrays.asList(notification1, notification2));
        when(notificationRepository.saveAll(anyList())).thenReturn(Arrays.asList());

        notificationService.markAllAsRead(user);

        assertTrue(notification1.getRead());
        assertTrue(notification2.getRead());
        verify(notificationRepository, times(1)).saveAll(anyList());
    }

    @Test
    void testGetUserNotifications_Success() {
        Notification notification1 = new Notification();
        notification1.setId(1L);
        notification1.setUser(user);

        Notification notification2 = new Notification();
        notification2.setId(2L);
        notification2.setUser(user);

        when(notificationRepository.findByUserOrderByCreatedAtDesc(user)).thenReturn(Arrays.asList(notification1, notification2));

        List<Notification> result = notificationService.getUserNotifications(user);

        assertEquals(2, result.size());
        verify(notificationRepository, times(1)).findByUserOrderByCreatedAtDesc(user);
    }

    @Test
    void testGetUnreadNotifications_Success() {
        Notification notification = new Notification();
        notification.setId(1L);
        notification.setUser(user);
        notification.setRead(false);

        when(notificationRepository.findByUserAndReadFalseOrderByCreatedAtDesc(user)).thenReturn(Arrays.asList(notification));

        List<Notification> result = notificationService.getUnreadNotifications(user);

        assertEquals(1, result.size());
        verify(notificationRepository, times(1)).findByUserAndReadFalseOrderByCreatedAtDesc(user);
    }

    @Test
    void testGetUnreadCount_Success() {
        when(notificationRepository.countByUserAndReadFalse(user)).thenReturn(5L);

        long count = notificationService.getUnreadCount(user);

        assertEquals(5L, count);
        verify(notificationRepository, times(1)).countByUserAndReadFalse(user);
    }

    @Test
    void testDeleteNotification_Success() {
        doNothing().when(notificationRepository).deleteById(1L);

        notificationService.deleteNotification(1L);

        verify(notificationRepository, times(1)).deleteById(1L);
    }
}
