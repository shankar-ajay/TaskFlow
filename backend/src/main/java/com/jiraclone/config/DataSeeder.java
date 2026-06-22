package com.jiraclone.config;

import com.jiraclone.model.Issue;
import com.jiraclone.model.Project;
import com.jiraclone.model.Sprint;
import com.jiraclone.repository.IssueRepository;
import com.jiraclone.repository.ProjectRepository;
import com.jiraclone.repository.SprintRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final ProjectRepository projectRepository;
    private final SprintRepository sprintRepository;
    private final IssueRepository issueRepository;

    @Override
    public void run(String... args) {
        if (projectRepository.count() > 0) return;

        Project project = projectRepository.save(Project.builder()
                .key("PROJ")
                .name("Project Alpha")
                .description("Main product development")
                .lead("Alice Johnson")
                .avatarColor("#5243AA")
                .build());

        Sprint sprint1 = sprintRepository.save(Sprint.builder()
                .name("Sprint 1")
                .goal("Foundation & Auth")
                .status(Sprint.SprintStatus.COMPLETED)
                .startDate(LocalDate.of(2026, 5, 1))
                .endDate(LocalDate.of(2026, 5, 14))
                .project(project)
                .build());

        Sprint sprint2 = sprintRepository.save(Sprint.builder()
                .name("Sprint 2")
                .goal("Core Features")
                .status(Sprint.SprintStatus.ACTIVE)
                .startDate(LocalDate.of(2026, 5, 15))
                .endDate(LocalDate.of(2026, 5, 28))
                .project(project)
                .build());

        issueRepository.save(Issue.builder()
                .title("Set up project structure")
                .description("Initialize the project with all required configurations.")
                .type(Issue.IssueType.TASK)
                .priority(Issue.IssuePriority.HIGH)
                .status(Issue.IssueStatus.DONE)
                .assignee("Alice Johnson")
                .reporter("Alice Johnson")
                .storyPoints(3)
                .label("setup")
                .sprint(sprint1)
                .project(project)
                .build());

        issueRepository.save(Issue.builder()
                .title("Implement user authentication")
                .description("Build login, registration, and JWT token handling.")
                .type(Issue.IssueType.STORY)
                .priority(Issue.IssuePriority.HIGHEST)
                .status(Issue.IssueStatus.DONE)
                .assignee("Bob Smith")
                .reporter("Alice Johnson")
                .storyPoints(8)
                .label("auth")
                .sprint(sprint1)
                .project(project)
                .build());

        issueRepository.save(Issue.builder()
                .title("Design dashboard layout")
                .description("Create the main dashboard with navigation and widgets.")
                .type(Issue.IssueType.TASK)
                .priority(Issue.IssuePriority.MEDIUM)
                .status(Issue.IssueStatus.IN_PROGRESS)
                .assignee("Carol White")
                .reporter("Alice Johnson")
                .storyPoints(5)
                .label("ui")
                .sprint(sprint2)
                .project(project)
                .build());

        issueRepository.save(Issue.builder()
                .title("Fix login page redirect bug")
                .description("After login, users are sometimes redirected to a 404 page.")
                .type(Issue.IssueType.BUG)
                .priority(Issue.IssuePriority.HIGHEST)
                .status(Issue.IssueStatus.TODO)
                .assignee("Alice Johnson")
                .reporter("Carol White")
                .storyPoints(2)
                .label("bug")
                .sprint(sprint2)
                .project(project)
                .build());

        issueRepository.save(Issue.builder()
                .title("Write unit tests for auth module")
                .description("Add comprehensive unit tests for all authentication flows.")
                .type(Issue.IssueType.TASK)
                .priority(Issue.IssuePriority.MEDIUM)
                .status(Issue.IssueStatus.TODO)
                .reporter("Alice Johnson")
                .storyPoints(5)
                .label("testing")
                .project(project)
                .build());

        System.out.println("Sample data seeded: 1 project, 2 sprints, 5 issues.");
    }
}
