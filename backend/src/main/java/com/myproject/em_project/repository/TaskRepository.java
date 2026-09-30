package com.myproject.em_project.repository;

import com.myproject.em_project.entity.Task;
import com.myproject.em_project.enums.TaskStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findByAssignedTo(Long employeeId);
    List<Task> findByAssignedBy(Long managerId);
    List<Task> findByStatus(TaskStatus status);
    List<Task> findByAssignedToAndStatus(Long employeeId, TaskStatus status);
}
