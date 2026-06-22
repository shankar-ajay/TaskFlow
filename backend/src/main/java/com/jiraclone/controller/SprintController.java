package com.jiraclone.controller;

import com.jiraclone.dto.SprintDTO;
import com.jiraclone.service.SprintService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sprints")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class SprintController {

    private final SprintService sprintService;

    @GetMapping
    public ResponseEntity<List<SprintDTO>> getSprintsByProject(@RequestParam Long projectId) {
        return ResponseEntity.ok(sprintService.getSprintsByProject(projectId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<SprintDTO> getSprintById(@PathVariable Long id) {
        return ResponseEntity.ok(sprintService.getSprintById(id));
    }

    @PostMapping
    public ResponseEntity<SprintDTO> createSprint(@RequestBody SprintDTO sprintDTO) {
        return ResponseEntity.ok(sprintService.createSprint(sprintDTO));
    }

    @PutMapping("/{id}")
    public ResponseEntity<SprintDTO> updateSprint(@PathVariable Long id, @RequestBody SprintDTO sprintDTO) {
        return ResponseEntity.ok(sprintService.updateSprint(id, sprintDTO));
    }

    @PostMapping("/{id}/start")
    public ResponseEntity<SprintDTO> startSprint(@PathVariable Long id) {
        return ResponseEntity.ok(sprintService.startSprint(id));
    }

    @PostMapping("/{id}/complete")
    public ResponseEntity<SprintDTO> completeSprint(@PathVariable Long id) {
        return ResponseEntity.ok(sprintService.completeSprint(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSprint(@PathVariable Long id) {
        sprintService.deleteSprint(id);
        return ResponseEntity.noContent().build();
    }
}
