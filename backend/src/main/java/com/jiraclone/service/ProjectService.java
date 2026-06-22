package com.jiraclone.service;

import com.jiraclone.dto.ProjectDTO;
import com.jiraclone.model.Project;
import com.jiraclone.repository.ProjectRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class ProjectService {

    private final ProjectRepository projectRepository;

    public List<ProjectDTO> getAllProjects() {
        return projectRepository.findAll()
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    public ProjectDTO getProjectById(Long id) {
        return projectRepository.findById(id)
                .map(this::toDTO)
                .orElseThrow(() -> new RuntimeException("Project not found: " + id));
    }

    public ProjectDTO createProject(ProjectDTO dto) {
        Project project = new Project();
        mapDTOToProject(dto, project);
        return toDTO(projectRepository.save(project));
    }

    public ProjectDTO updateProject(Long id, ProjectDTO dto) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Project not found: " + id));
        mapDTOToProject(dto, project);
        return toDTO(projectRepository.save(project));
    }

    public void deleteProject(Long id) {
        projectRepository.deleteById(id);
    }

    private void mapDTOToProject(ProjectDTO dto, Project project) {
        project.setKey(dto.getKey());
        project.setName(dto.getName());
        project.setDescription(dto.getDescription());
        project.setLead(dto.getLead());
        project.setAvatarColor(dto.getAvatarColor());
    }

    private ProjectDTO toDTO(Project project) {
        return ProjectDTO.builder()
                .id(project.getId())
                .key(project.getKey())
                .name(project.getName())
                .description(project.getDescription())
                .lead(project.getLead())
                .avatarColor(project.getAvatarColor())
                .totalIssues(project.getIssues() != null ? project.getIssues().size() : 0)
                .totalSprints(project.getSprints() != null ? project.getSprints().size() : 0)
                .createdAt(project.getCreatedAt())
                .build();
    }
}
