package com.jiraclone.service;

import com.jiraclone.dto.IssueDTO;
import com.jiraclone.dto.SprintDTO;
import com.jiraclone.model.Issue;
import com.jiraclone.model.Project;
import com.jiraclone.model.Sprint;
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
public class SprintService {

    private final SprintRepository sprintRepository;
    private final ProjectRepository projectRepository;

    public List<SprintDTO> getSprintsByProject(Long projectId) {
        return sprintRepository.findByProjectId(projectId)
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    public SprintDTO getSprintById(Long id) {
        return sprintRepository.findById(id)
                .map(this::toDTO)
                .orElseThrow(() -> new RuntimeException("Sprint not found: " + id));
    }

    public SprintDTO createSprint(SprintDTO dto) {
        Sprint sprint = new Sprint();
        mapDTOToSprint(dto, sprint);
        return toDTO(sprintRepository.save(sprint));
    }

    public SprintDTO updateSprint(Long id, SprintDTO dto) {
        Sprint sprint = sprintRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Sprint not found: " + id));
        mapDTOToSprint(dto, sprint);
        return toDTO(sprintRepository.save(sprint));
    }

    public SprintDTO startSprint(Long id) {
        Sprint sprint = sprintRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Sprint not found: " + id));
        sprint.setStatus(Sprint.SprintStatus.ACTIVE);
        return toDTO(sprintRepository.save(sprint));
    }

    public SprintDTO completeSprint(Long id) {
        Sprint sprint = sprintRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Sprint not found: " + id));
        sprint.setStatus(Sprint.SprintStatus.COMPLETED);
        return toDTO(sprintRepository.save(sprint));
    }

    public void deleteSprint(Long id) {
        sprintRepository.deleteById(id);
    }

    private void mapDTOToSprint(SprintDTO dto, Sprint sprint) {
        sprint.setName(dto.getName());
        sprint.setGoal(dto.getGoal());
        sprint.setStartDate(dto.getStartDate());
        sprint.setEndDate(dto.getEndDate());
        sprint.setStatus(dto.getStatus() != null ? dto.getStatus() : Sprint.SprintStatus.PLANNED);

        if (dto.getProjectId() != null) {
            Project project = projectRepository.findById(dto.getProjectId())
                    .orElseThrow(() -> new RuntimeException("Project not found"));
            sprint.setProject(project);
        }
    }

    private SprintDTO toDTO(Sprint sprint) {
        List<IssueDTO> issueDTOs = sprint.getIssues() == null ? List.of() :
                sprint.getIssues().stream().map(issue -> IssueDTO.builder()
                        .id(issue.getId())
                        .title(issue.getTitle())
                        .type(issue.getType())
                        .priority(issue.getPriority())
                        .status(issue.getStatus())
                        .assignee(issue.getAssignee())
                        .storyPoints(issue.getStoryPoints())
                        .build()).collect(Collectors.toList());

        long completed = issueDTOs.stream()
                .filter(i -> i.getStatus() == Issue.IssueStatus.DONE).count();

        return SprintDTO.builder()
                .id(sprint.getId())
                .name(sprint.getName())
                .goal(sprint.getGoal())
                .status(sprint.getStatus())
                .startDate(sprint.getStartDate())
                .endDate(sprint.getEndDate())
                .projectId(sprint.getProject() != null ? sprint.getProject().getId() : null)
                .issues(issueDTOs)
                .totalIssues(issueDTOs.size())
                .completedIssues((int) completed)
                .createdAt(sprint.getCreatedAt())
                .build();
    }
}
