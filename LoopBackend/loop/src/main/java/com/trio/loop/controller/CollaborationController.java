package com.trio.loop.controller;

import com.trio.loop.Repositories.CollaborationRequestRepository;
import com.trio.loop.Repositories.ProjectRepository;
import com.trio.loop.model.CollaborationRequest;
import com.trio.loop.model.Project;
import com.trio.loop.model.Users;
import com.trio.loop.util.CurrentUserProvider;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.List;

@RestController
@RequestMapping("/api/collab")
public class CollaborationController {

    private final CollaborationRequestRepository collabRepo;
    private final ProjectRepository projectRepo;
    private final CurrentUserProvider currentUserProvider;

    public CollaborationController(CollaborationRequestRepository collabRepo,
                                   ProjectRepository projectRepo,
                                   CurrentUserProvider currentUserProvider) {
        this.collabRepo = collabRepo;
        this.projectRepo = projectRepo;
        this.currentUserProvider = currentUserProvider;
    }

    @PostMapping("/request/{projectId}")
    public ResponseEntity<CollaborationRequest> createRequest(
            @PathVariable Long projectId,
            @RequestParam String type,
            @RequestParam(required = false) String message
    ) {
        Users from = currentUserProvider.getCurrentUser();
        Project project = projectRepo.findById(projectId).orElseThrow();
        Users to = project.getOwner();

        CollaborationRequest req = CollaborationRequest.builder()
                .project(project)
                .fromUser(from)
                .toUser(to)
                .type(type.toUpperCase()) // COLLAB or TAKEOVER
                .status("PENDING")
                .message(message)
                .createdAt(Instant.now())
                .build();

        return ResponseEntity.ok(collabRepo.save(req));
    }

    @GetMapping("/inbox")
    public List<CollaborationRequest> getInbox() {
        Users user = currentUserProvider.getCurrentUser();
        return collabRepo.findByToUser(user);
    }

    @PostMapping("/{id}/respond")
    public ResponseEntity<CollaborationRequest> respond(
            @PathVariable Long id,
            @RequestParam String status
    ) {
        Users user = currentUserProvider.getCurrentUser();
        CollaborationRequest req = collabRepo.findById(id).orElseThrow();
        if (!req.getToUser().getId().equals(user.getId())) {
            return ResponseEntity.status(403).build();
        }
        req.setStatus(status.toUpperCase()); // ACCEPTED or REJECTED
        return ResponseEntity.ok(collabRepo.save(req));
    }
}
