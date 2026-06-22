package com.jiraclone.dto;

import com.jiraclone.model.Issue;
import lombok.*;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class IssueDTO {
    private Long id;
    private String title;
    private String description;
    private Issue.IssueType type;
    private Issue.IssuePriority priority;
    private Issue.IssueStatus status;
    private String assignee;
    private String reporter;
    private Integer storyPoints;
    private String label;
    private Long sprintId;
    private Long projectId;
    private String projectKey;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
