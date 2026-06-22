package com.jiraclone.dto;

import lombok.*;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProjectDTO {
    private Long id;
    private String key;
    private String name;
    private String description;
    private String lead;
    private String avatarColor;
    private int totalIssues;
    private int totalSprints;
    private LocalDateTime createdAt;
}
