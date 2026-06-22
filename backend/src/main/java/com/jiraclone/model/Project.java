package com.jiraclone.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "projects")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Project {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "project_key", nullable = false, unique = true)
    private String key;

    @Column(nullable = false)
    private String name;

    private String description;
    @Column(name = "project_lead")
    private String lead;
    private String avatarColor;

    @OneToMany(mappedBy = "project", cascade = CascadeType.ALL)
    private List<Issue> issues;

    @OneToMany(mappedBy = "project", cascade = CascadeType.ALL)
    private List<Sprint> sprints;

    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
