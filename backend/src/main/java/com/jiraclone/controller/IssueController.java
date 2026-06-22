package com.jiraclone.controller;

import com.jiraclone.dto.IssueDTO;
import com.jiraclone.model.Issue;
import com.jiraclone.service.IssueService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/issues")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class IssueController {

    private final IssueService issueService;

    @GetMapping
    public ResponseEntity<List<IssueDTO>> getAllIssues(
            @RequestParam(required = false) Long projectId,
            @RequestParam(required = false) Long sprintId,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String assignee) {
        return ResponseEntity.ok(issueService.getIssues(projectId, sprintId, status, assignee));
    }

    @GetMapping("/{id}")
    public ResponseEntity<IssueDTO> getIssueById(@PathVariable Long id) {
        return ResponseEntity.ok(issueService.getIssueById(id));
    }

    @PostMapping
    public ResponseEntity<IssueDTO> createIssue(@RequestBody IssueDTO issueDTO) {
        return ResponseEntity.ok(issueService.createIssue(issueDTO));
    }

    @PutMapping("/{id}")
    public ResponseEntity<IssueDTO> updateIssue(@PathVariable Long id, @RequestBody IssueDTO issueDTO) {
        return ResponseEntity.ok(issueService.updateIssue(id, issueDTO));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<IssueDTO> updateIssueStatus(
            @PathVariable Long id,
            @RequestParam String status) {
        return ResponseEntity.ok(issueService.updateStatus(id, Issue.IssueStatus.valueOf(status)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteIssue(@PathVariable Long id) {
        issueService.deleteIssue(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/backlog")
    public ResponseEntity<List<IssueDTO>> getBacklogIssues(@RequestParam Long projectId) {
        return ResponseEntity.ok(issueService.getBacklogIssues(projectId));
    }
}
