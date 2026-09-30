package com.myproject.em_project.controller;

import com.myproject.em_project.dto.LeaveRequestDTO;
import com.myproject.em_project.entity.LeaveRequest;
import com.myproject.em_project.service.AuthService;
import com.myproject.em_project.service.LeaveRequestService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/leave-requests")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class LeaveRequestController {

    private final LeaveRequestService leaveRequestService;
    private final AuthService authService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'HR')")
    public ResponseEntity<List<LeaveRequest>> getAllLeaveRequests() {
        return ResponseEntity.ok(leaveRequestService.getAllLeaveRequests());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'HR', 'EMPLOYEE')")
    public ResponseEntity<LeaveRequest> getLeaveRequestById(@PathVariable Long id) {
        return ResponseEntity.ok(leaveRequestService.getLeaveRequestById(id));
    }

    @PostMapping
    @PreAuthorize("hasRole('EMPLOYEE')")
    public ResponseEntity<LeaveRequest> createLeaveRequest(@Valid @RequestBody LeaveRequestDTO leaveRequestDTO) {
        Long currentUserId = authService.getCurrentUser().getId();
        leaveRequestDTO.setEmployeeId(currentUserId);
        return ResponseEntity.ok(leaveRequestService.createLeaveRequest(leaveRequestDTO));
    }

    @PutMapping("/{id}/approve")
    @PreAuthorize("hasAnyRole('ADMIN', 'HR')")
    public ResponseEntity<LeaveRequest> approveLeaveRequest(@PathVariable Long id) {
        Long currentUserId = authService.getCurrentUser().getId();
        return ResponseEntity.ok(leaveRequestService.approveLeaveRequest(id, currentUserId));
    }

    @PutMapping("/{id}/reject")
    @PreAuthorize("hasAnyRole('ADMIN', 'HR')")
    public ResponseEntity<LeaveRequest> rejectLeaveRequest(
            @PathVariable Long id,
            @RequestBody String rejectionReason) {
        Long currentUserId = authService.getCurrentUser().getId();
        return ResponseEntity.ok(leaveRequestService.rejectLeaveRequest(id, currentUserId, rejectionReason));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> deleteLeaveRequest(@PathVariable Long id) {
        leaveRequestService.deleteLeaveRequest(id);
        return ResponseEntity.ok("Leave request deleted successfully");
    }

    @GetMapping("/my-requests")
    @PreAuthorize("hasRole('EMPLOYEE')")
    public ResponseEntity<List<LeaveRequest>> getMyLeaveRequests() {
        Long currentUserId = authService.getCurrentUser().getId();
        return ResponseEntity.ok(leaveRequestService.getLeaveRequestsByEmployee(currentUserId));
    }

    @GetMapping("/pending")
    @PreAuthorize("hasAnyRole('ADMIN', 'HR')")
    public ResponseEntity<List<LeaveRequest>> getPendingLeaveRequests() {
        return ResponseEntity.ok(leaveRequestService.getPendingLeaveRequests());
    }
}
