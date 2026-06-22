package com.jiraclone.service;

import com.jiraclone.dto.IssueDTO;
import com.jiraclone.model.Issue;
import com.jiraclone.model.Project;
import com.jiraclone.model.Sprint;
import com.jiraclone.repository.IssueRepository;
import com.jiraclone.repository.ProjectRepository;
import com.jiraclone.repository.SprintRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class IssueService {

    private final IssueRepository issueRepository;
    private final ProjectRepository projectRepository;
    private final SprintRepository sprintRepository;

    public List<IssueDTO> getIssues(Long projectId, Long sprintId, String status, String assignee) {
        List<Issue> issues;
        if (sprintId != null) {
            issues = issueRepository.findBySprintId(sprintId);
        } else if (projectId != null) {
            issues = issueRepository.findByProjectId(projectId);
        } else {
            issues = issueRepository.findAll();
        }

        if (status != null) {
            Issue.IssueStatus issueStatus = Issue.IssueStatus.valueOf(status);
            issues = issues.stream().filter(i -> i.getStatus() == issueStatus).collect(Collectors.toList());
        }
        if (assignee != null) {
            issues = issues.stream().filter(i -> assignee.equals(i.getAssignee())).collect(Collectors.toList());
        }

        return issues.stream().map(this::toDTO).collect(Collectors.toList());
    }

    public IssueDTO getIssueById(Long id) {
        return issueRepository.findById(id)
                .map(this::toDTO)
                .orElseThrow(() -> new RuntimeException("Issue not found: " + id));
    }

    public IssueDTO createIssue(IssueDTO dto) {
        Issue issue = new Issue();
        mapDTOToIssue(dto, issue);
        return toDTO(issueRepository.save(issue));
    }

    public IssueDTO updateIssue(Long id, IssueDTO dto) {
        Issue issue = issueRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Issue not found: " + id));
        mapDTOToIssue(dto, issue);
        return toDTO(issueRepository.save(issue));
    }

    public IssueDTO updateStatus(Long id, Issue.IssueStatus status) {
        Issue issue = issueRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Issue not found: " + id));
        issue.setStatus(status);
        return toDTO(issueRepository.save(issue));
    }

    public void deleteIssue(Long id) {
        issueRepository.deleteById(id);
    }

    public List<IssueDTO> getBacklogIssues(Long projectId) {
        return issueRepository.findByProjectIdAndSprintIsNull(projectId)
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    private void mapDTOToIssue(IssueDTO dto, Issue issue) {
        issue.setTitle(dto.getTitle());
        issue.setDescription(dto.getDescription());
        issue.setType(dto.getType());
        issue.setPriority(dto.getPriority());
        issue.setStatus(dto.getStatus() != null ? dto.getStatus() : Issue.IssueStatus.TODO);
        issue.setAssignee(dto.getAssignee());
        issue.setReporter(dto.getReporter());
        issue.setStoryPoints(dto.getStoryPoints());
        issue.setLabel(dto.getLabel());

        if (dto.getProjectId() != null) {
            Project project = projectRepository.findById(dto.getProjectId())
                    .orElseThrow(() -> new RuntimeException("Project not found"));
            issue.setProject(project);
        }

        if (dto.getSprintId() != null) {
            Sprint sprint = sprintRepository.findById(dto.getSprintId())
                    .orElseThrow(() -> new RuntimeException("Sprint not found"));
            issue.setSprint(sprint);
        } else {
            issue.setSprint(null);
        }
    }

    private IssueDTO toDTO(Issue issue) {
        return IssueDTO.builder()
                .id(issue.getId())
                .title(issue.getTitle())
                .description(issue.getDescription())
                .type(issue.getType())
                .priority(issue.getPriority())
                .status(issue.getStatus())
                .assignee(issue.getAssignee())
                .reporter(issue.getReporter())
                .storyPoints(issue.getStoryPoints())
                .label(issue.getLabel())
                .sprintId(issue.getSprint() != null ? issue.getSprint().getId() : null)
                .projectId(issue.getProject() != null ? issue.getProject().getId() : null)
                .projectKey(issue.getProject() != null ? issue.getProject().getKey() : null)
                .createdAt(issue.getCreatedAt())
                .updatedAt(issue.getUpdatedAt())
                .build();
    }
}
