package com.jiraclone.repository;

import com.jiraclone.model.Issue;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IssueRepository extends JpaRepository<Issue, Long> {
    List<Issue> findByProjectId(Long projectId);
    List<Issue> findBySprintId(Long sprintId);
    List<Issue> findByProjectIdAndSprintIsNull(Long projectId);
    List<Issue> findByAssignee(String assignee);
}
