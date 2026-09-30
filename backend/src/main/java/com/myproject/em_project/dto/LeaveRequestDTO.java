package com.myproject.em_project.dto;

import com.myproject.em_project.enums.LeaveStatus;
import com.myproject.em_project.enums.LeaveType;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LeaveRequestDTO {
    private Long id;
    private Long employeeId;

    @NotNull(message = "Leave type is required")
    private LeaveType leaveType;

    @NotNull(message = "Start date is required")
    private LocalDate startDate;

    @NotNull(message = "End date is required")
    private LocalDate endDate;

    @NotNull(message = "Total days is required")
    private Integer totalDays;

    private String reason;

    private LeaveStatus status;
    private Long approvedBy;
    private String rejectionReason;
}
