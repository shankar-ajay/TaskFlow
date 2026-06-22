package com.jiraclone.dto;

import com.jiraclone.model.Sprint;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SprintDTO {
    private Long id;
    private String name;
    private String goal;
    private Sprint.SprintStatus status;
    private LocalDate startDate;
    private LocalDate endDate;
    private Long projectId;
    private List<IssueDTO> issues;
    private LocalDateTime createdAt;
    private int totalIssues;
    private int completedIssues;
}
