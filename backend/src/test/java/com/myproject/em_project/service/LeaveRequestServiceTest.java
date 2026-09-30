package com.myproject.em_project.service;

import com.myproject.em_project.dto.LeaveRequestDTO;
import com.myproject.em_project.entity.LeaveRequest;
import com.myproject.em_project.enums.LeaveStatus;
import com.myproject.em_project.enums.LeaveType;
import com.myproject.em_project.repository.LeaveRequestRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class LeaveRequestServiceTest {

    @Mock
    private LeaveRequestRepository leaveRequestRepository;

    @InjectMocks
    private LeaveRequestService leaveRequestService;

    private LeaveRequest leaveRequest;
    private LeaveRequestDTO leaveRequestDTO;

    @BeforeEach
    void setUp() {
        leaveRequest = new LeaveRequest();
        leaveRequest.setId(1L);
        leaveRequest.setEmployeeId(1L);
        leaveRequest.setLeaveType(LeaveType.SICK_LEAVE);
        leaveRequest.setStartDate(LocalDate.now());
        leaveRequest.setEndDate(LocalDate.now().plusDays(2));
        leaveRequest.setTotalDays(3);
        leaveRequest.setReason("Medical appointment");
        leaveRequest.setStatus(LeaveStatus.PENDING);

        leaveRequestDTO = new LeaveRequestDTO();
        leaveRequestDTO.setEmployeeId(1L);
        leaveRequestDTO.setLeaveType(LeaveType.SICK_LEAVE);
        leaveRequestDTO.setStartDate(LocalDate.now());
        leaveRequestDTO.setEndDate(LocalDate.now().plusDays(2));
        leaveRequestDTO.setTotalDays(3);
        leaveRequestDTO.setReason("Medical appointment");
    }

    @Test
    void testGetAllLeaveRequests() {
        when(leaveRequestRepository.findAll()).thenReturn(Arrays.asList(leaveRequest));

        List<LeaveRequest> requests = leaveRequestService.getAllLeaveRequests();

        assertNotNull(requests);
        assertEquals(1, requests.size());
        verify(leaveRequestRepository, times(1)).findAll();
    }

    @Test
    void testCreateLeaveRequest() {
        when(leaveRequestRepository.save(any(LeaveRequest.class))).thenReturn(leaveRequest);

        LeaveRequest createdRequest = leaveRequestService.createLeaveRequest(leaveRequestDTO);

        assertNotNull(createdRequest);
        assertEquals(LeaveStatus.PENDING, createdRequest.getStatus());
        verify(leaveRequestRepository, times(1)).save(any(LeaveRequest.class));
    }

    @Test
    void testApproveLeaveRequest() {
        when(leaveRequestRepository.findById(1L)).thenReturn(Optional.of(leaveRequest));
        when(leaveRequestRepository.save(any(LeaveRequest.class))).thenReturn(leaveRequest);

        LeaveRequest approvedRequest = leaveRequestService.approveLeaveRequest(1L, 2L);

        assertNotNull(approvedRequest);
        assertEquals(LeaveStatus.APPROVED, approvedRequest.getStatus());
        assertEquals(2L, approvedRequest.getApprovedBy());
        verify(leaveRequestRepository, times(1)).save(any(LeaveRequest.class));
    }

    @Test
    void testRejectLeaveRequest() {
        when(leaveRequestRepository.findById(1L)).thenReturn(Optional.of(leaveRequest));
        when(leaveRequestRepository.save(any(LeaveRequest.class))).thenReturn(leaveRequest);

        LeaveRequest rejectedRequest = leaveRequestService.rejectLeaveRequest(1L, 2L, "Insufficient leave balance");

        assertNotNull(rejectedRequest);
        assertEquals(LeaveStatus.REJECTED, rejectedRequest.getStatus());
        assertEquals("Insufficient leave balance", rejectedRequest.getRejectionReason());
        verify(leaveRequestRepository, times(1)).save(any(LeaveRequest.class));
    }

    @Test
    void testGetPendingLeaveRequests() {
        when(leaveRequestRepository.findByStatus(LeaveStatus.PENDING))
                .thenReturn(Arrays.asList(leaveRequest));

        List<LeaveRequest> pendingRequests = leaveRequestService.getPendingLeaveRequests();

        assertNotNull(pendingRequests);
        assertEquals(1, pendingRequests.size());
        verify(leaveRequestRepository, times(1)).findByStatus(LeaveStatus.PENDING);
    }
}
