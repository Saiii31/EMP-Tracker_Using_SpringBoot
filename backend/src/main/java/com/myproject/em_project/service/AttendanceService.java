package com.myproject.em_project.service;

import com.myproject.em_project.dto.AttendanceDTO;
import com.myproject.em_project.entity.Attendance;
import com.myproject.em_project.repository.AttendanceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AttendanceService {

    private final AttendanceRepository attendanceRepository;

    public List<Attendance> getAllAttendance() {
        return attendanceRepository.findAll();
    }

    public Attendance getAttendanceById(Long id) {
        return attendanceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Attendance not found with id: " + id));
    }

    @Transactional
    public Attendance checkIn(Long employeeId) {
        LocalDate today = LocalDate.now();
        Optional<Attendance> existingAttendance = attendanceRepository.findByEmployeeIdAndDate(employeeId, today);

        if (existingAttendance.isPresent()) {
            throw new RuntimeException("Already checked in for today");
        }

        Attendance attendance = new Attendance();
        attendance.setEmployeeId(employeeId);
        attendance.setDate(today);
        attendance.setCheckInTime(LocalDateTime.now());
        attendance.setStatus("PRESENT");
        return attendanceRepository.save(attendance);
    }

    @Transactional
    public Attendance checkOut(Long employeeId) {
        LocalDate today = LocalDate.now();
        Attendance attendance = attendanceRepository.findByEmployeeIdAndDate(employeeId, today)
                .orElseThrow(() -> new RuntimeException("No check-in found for today"));

        if (attendance.getCheckOutTime() != null) {
            throw new RuntimeException("Already checked out for today");
        }

        attendance.setCheckOutTime(LocalDateTime.now());

        Duration duration = Duration.between(attendance.getCheckInTime(), attendance.getCheckOutTime());
        double totalHours = duration.toMinutes() / 60.0;
        attendance.setTotalHours(totalHours);

        return attendanceRepository.save(attendance);
    }

    @Transactional
    public Attendance createAttendance(AttendanceDTO attendanceDTO) {
        Attendance attendance = new Attendance();
        attendance.setEmployeeId(attendanceDTO.getEmployeeId());
        attendance.setDate(attendanceDTO.getDate());
        attendance.setCheckInTime(attendanceDTO.getCheckInTime());
        attendance.setCheckOutTime(attendanceDTO.getCheckOutTime());
        attendance.setTotalHours(attendanceDTO.getTotalHours());
        attendance.setStatus(attendanceDTO.getStatus());
        attendance.setNotes(attendanceDTO.getNotes());
        return attendanceRepository.save(attendance);
    }

    @Transactional
    public Attendance updateAttendance(Long id, AttendanceDTO attendanceDTO) {
        Attendance attendance = getAttendanceById(id);
        attendance.setEmployeeId(attendanceDTO.getEmployeeId());
        attendance.setDate(attendanceDTO.getDate());
        attendance.setCheckInTime(attendanceDTO.getCheckInTime());
        attendance.setCheckOutTime(attendanceDTO.getCheckOutTime());
        attendance.setTotalHours(attendanceDTO.getTotalHours());
        attendance.setStatus(attendanceDTO.getStatus());
        attendance.setNotes(attendanceDTO.getNotes());
        return attendanceRepository.save(attendance);
    }

    @Transactional
    public void deleteAttendance(Long id) {
        Attendance attendance = getAttendanceById(id);
        attendanceRepository.delete(attendance);
    }

    public List<Attendance> getAttendanceByEmployee(Long employeeId) {
        return attendanceRepository.findByEmployeeId(employeeId);
    }

    public List<Attendance> getAttendanceByDateRange(LocalDate startDate, LocalDate endDate) {
        return attendanceRepository.findByDateBetween(startDate, endDate);
    }
}
