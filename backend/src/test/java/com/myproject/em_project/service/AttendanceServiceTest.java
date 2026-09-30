package com.myproject.em_project.service;

import com.myproject.em_project.dto.AttendanceDTO;
import com.myproject.em_project.entity.Attendance;
import com.myproject.em_project.repository.AttendanceRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AttendanceServiceTest {

    @Mock
    private AttendanceRepository attendanceRepository;

    @InjectMocks
    private AttendanceService attendanceService;

    private Attendance attendance;
    private AttendanceDTO attendanceDTO;

    @BeforeEach
    void setUp() {
        attendance = new Attendance();
        attendance.setId(1L);
        attendance.setEmployeeId(1L);
        attendance.setDate(LocalDate.now());
        attendance.setCheckInTime(LocalDateTime.now().withHour(9).withMinute(0));
        attendance.setCheckOutTime(LocalDateTime.now().withHour(17).withMinute(0));
        attendance.setTotalHours(8.0);
        attendance.setStatus("PRESENT");

        attendanceDTO = new AttendanceDTO();
        attendanceDTO.setEmployeeId(1L);
        attendanceDTO.setDate(LocalDate.now());
        attendanceDTO.setCheckInTime(LocalDateTime.now().withHour(9).withMinute(0));
        attendanceDTO.setCheckOutTime(LocalDateTime.now().withHour(17).withMinute(0));
        attendanceDTO.setTotalHours(8.0);
        attendanceDTO.setStatus("PRESENT");
    }

    @Test
    void testGetAllAttendance() {
        when(attendanceRepository.findAll()).thenReturn(Arrays.asList(attendance));

        List<Attendance> attendanceList = attendanceService.getAllAttendance();

        assertNotNull(attendanceList);
        assertEquals(1, attendanceList.size());
        verify(attendanceRepository, times(1)).findAll();
    }

    @Test
    void testCheckIn_Success() {
        when(attendanceRepository.findByEmployeeIdAndDate(1L, LocalDate.now()))
                .thenReturn(Optional.empty());
        when(attendanceRepository.save(any(Attendance.class))).thenReturn(attendance);

        Attendance checkedIn = attendanceService.checkIn(1L);

        assertNotNull(checkedIn);
        assertEquals("PRESENT", checkedIn.getStatus());
        verify(attendanceRepository, times(1)).save(any(Attendance.class));
    }

    @Test
    void testCheckIn_AlreadyCheckedIn() {
        when(attendanceRepository.findByEmployeeIdAndDate(1L, LocalDate.now()))
                .thenReturn(Optional.of(attendance));

        assertThrows(RuntimeException.class, () -> attendanceService.checkIn(1L));
        verify(attendanceRepository, never()).save(any());
    }

    @Test
    void testCheckOut_Success() {
        attendance.setCheckOutTime(null);
        when(attendanceRepository.findByEmployeeIdAndDate(1L, LocalDate.now()))
                .thenReturn(Optional.of(attendance));
        when(attendanceRepository.save(any(Attendance.class))).thenReturn(attendance);

        Attendance checkedOut = attendanceService.checkOut(1L);

        assertNotNull(checkedOut);
        assertNotNull(checkedOut.getCheckOutTime());
        verify(attendanceRepository, times(1)).save(any(Attendance.class));
    }

    @Test
    void testCheckOut_AlreadyCheckedOut() {
        attendance.setCheckOutTime(LocalDateTime.now());
        when(attendanceRepository.findByEmployeeIdAndDate(1L, LocalDate.now()))
                .thenReturn(Optional.of(attendance));

        assertThrows(RuntimeException.class, () -> attendanceService.checkOut(1L));
        verify(attendanceRepository, never()).save(any());
    }

    @Test
    void testCreateAttendance() {
        when(attendanceRepository.save(any(Attendance.class))).thenReturn(attendance);

        Attendance created = attendanceService.createAttendance(attendanceDTO);

        assertNotNull(created);
        verify(attendanceRepository, times(1)).save(any(Attendance.class));
    }

    @Test
    void testGetAttendanceByEmployee() {
        when(attendanceRepository.findByEmployeeId(1L)).thenReturn(Arrays.asList(attendance));

        List<Attendance> attendanceList = attendanceService.getAttendanceByEmployee(1L);

        assertNotNull(attendanceList);
        assertEquals(1, attendanceList.size());
        verify(attendanceRepository, times(1)).findByEmployeeId(1L);
    }
}
