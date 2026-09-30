package com.myproject.em_project.service;

import com.myproject.em_project.dto.LoginRequest;
import com.myproject.em_project.dto.LoginResponse;
import com.myproject.em_project.dto.RegisterRequest;
import com.myproject.em_project.entity.Tenant;
import com.myproject.em_project.entity.User;
import com.myproject.em_project.enums.Role;
import com.myproject.em_project.repository.TenantRepository;
import com.myproject.em_project.repository.UserRepository;
import com.myproject.em_project.security.JwtTokenProvider;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private UserRepository userRepository;

    @Mock
    private TenantRepository tenantRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtTokenProvider tokenProvider;

    @Mock
    private Authentication authentication;

    @InjectMocks
    private AuthService authService;

    private LoginRequest loginRequest;
    private RegisterRequest registerRequest;
    private User user;

    @BeforeEach
    void setUp() {
        loginRequest = new LoginRequest("admin", "admin123");
        registerRequest = new RegisterRequest("newuser", "password123", "password123", "user@example.com", Role.EMPLOYEE);
        user = new User();
        user.setId(1L);
        user.setUsername("admin");
        user.setEmail("admin@example.com");
        user.setRole(Role.ADMIN);
    }

    @Test
    void testLogin_Success() {
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenReturn(authentication);
        when(authentication.getPrincipal()).thenReturn(user);
        when(tokenProvider.generateToken(any(Authentication.class))).thenReturn("jwt-token");

        LoginResponse response = authService.login(loginRequest);

        assertNotNull(response);
        assertEquals("jwt-token", response.getToken());
        assertEquals("Bearer", response.getType());
        assertEquals(1L, response.getUserId());
        assertEquals("admin", response.getUsername());
        verify(authenticationManager, times(1)).authenticate(any());
        verify(tokenProvider, times(1)).generateToken(any());
    }

    @Test
    void testRegister_Success() {
        when(userRepository.existsByUsername(anyString())).thenReturn(false);
        when(userRepository.existsByEmail(anyString())).thenReturn(false);
        when(tenantRepository.findByTenantCode(anyString())).thenReturn(Optional.empty());
        when(passwordEncoder.encode(anyString())).thenReturn("encoded-password");
        when(userRepository.save(any(User.class))).thenReturn(user);

        assertDoesNotThrow(() -> authService.register(registerRequest));

        verify(userRepository, times(1)).existsByUsername("newuser");
        verify(userRepository, times(1)).existsByEmail("user@example.com");
        verify(tenantRepository, times(1)).findByTenantCode("DEFAULT");
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    void testRegister_UsernameExists() {
        when(userRepository.existsByUsername(anyString())).thenReturn(true);

        RuntimeException exception = assertThrows(RuntimeException.class,
                () -> authService.register(registerRequest));

        assertEquals("Username is already taken!", exception.getMessage());
        verify(userRepository, never()).save(any());
    }

    @Test
    void testRegister_EmailExists() {
        when(userRepository.existsByUsername(anyString())).thenReturn(false);
        when(userRepository.existsByEmail(anyString())).thenReturn(true);

        RuntimeException exception = assertThrows(RuntimeException.class,
                () -> authService.register(registerRequest));

        assertEquals("Email is already in use!", exception.getMessage());
        verify(userRepository, never()).save(any());
    }

    @Test
    void testRegister_PasswordMismatch() {
        registerRequest = new RegisterRequest("newuser", "password123", "different123", "user@example.com", Role.EMPLOYEE);
        when(userRepository.existsByUsername(anyString())).thenReturn(false);
        when(userRepository.existsByEmail(anyString())).thenReturn(false);

        RuntimeException exception = assertThrows(RuntimeException.class,
                () -> authService.register(registerRequest));

        assertEquals("Passwords do not match!", exception.getMessage());
        verify(userRepository, never()).save(any());
    }
}
