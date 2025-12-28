package com.trio.loop.controller;

import com.trio.loop.Repositories.ProjectLikeRepository;
import com.trio.loop.Repositories.ProjectRepository;
import com.trio.loop.Repositories.UserRepository;
import com.trio.loop.dto.OwnerDto;
import com.trio.loop.dto.ProjectDTO;
import com.trio.loop.model.Project;
import com.trio.loop.model.ProjectLike;
import com.trio.loop.model.Users;
import com.trio.loop.util.CurrentUserProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/projects")
public class ProjectController {

    private final ProjectRepository projectRepository;
    private final ProjectLikeRepository projectLikeRepository;
    private final CurrentUserProvider currentUserProvider;
    private final UserRepository userRepository; // Made final

    // Updated constructor to include UserRepository
    public ProjectController(ProjectRepository projectRepository,
                             ProjectLikeRepository projectLikeRepository,
                             CurrentUserProvider currentUserProvider,
                             UserRepository userRepository) { // Added parameter
        this.projectRepository = projectRepository;
        this.projectLikeRepository = projectLikeRepository;
        this.currentUserProvider = currentUserProvider;
        this.userRepository = userRepository; // Initialize here
    }

    @GetMapping
    public List<ProjectDTO> getAllProjects(@RequestParam(required = false) String status) {
        List<Project> projects;
        if (status != null && !status.equalsIgnoreCase("all")) {
            projects = projectRepository.findByStatus(status.toUpperCase());
        } else {
            projects = projectRepository.findAll();
        }
        return projects.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @GetMapping("/mine")
    public List<ProjectDTO> getMyProjects() {
        Users user = currentUserProvider.getCurrentUser();
        return projectRepository.findByOwner(user).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @GetMapping("/trending")
    public List<ProjectDTO> getTrendingProjects(@RequestParam(defaultValue = "10") int limit) {
        List<Project> projects = projectRepository.findAll().stream()
                .sorted((p1, p2) -> Integer.compare(p2.getLikesCount(), p1.getLikesCount()))
                .limit(limit)
                .collect(Collectors.toList());

        return projects.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @PostMapping
    public ResponseEntity<ProjectDTO> createProject(@RequestBody Project project) {
        Users user = currentUserProvider.getCurrentUser();
        project.setId(null);
        project.setOwner(user);
        project.setCreatedAt(Instant.now());
        project.setLikesCount(0);
        if (project.getStatus() == null) {
            project.setStatus("LOOKING_FOR_TEAM");
        }
        Project saved = projectRepository.save(project);
        return ResponseEntity.ok(convertToDTO(saved));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProjectDTO> updateProject(@PathVariable Long id,
                                                    @RequestBody Project update) {
        Users user = currentUserProvider.getCurrentUser();
        Project existing = projectRepository.findById(id).orElseThrow();
        if (!existing.getOwner().getId().equals(user.getId())) {
            return ResponseEntity.status(403).build();
        }

        existing.setTitle(update.getTitle());
        existing.setAbstractText(update.getAbstractText());
        existing.setImageUrl(update.getImageUrl());
        existing.setStatus(update.getStatus());
        existing.setTags(update.getTags());
        existing.setTechStack(update.getTechStack());

        Project saved = projectRepository.save(existing);
        return ResponseEntity.ok(convertToDTO(saved));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteProject(@PathVariable Long id) {
        Users user = currentUserProvider.getCurrentUser();
        Project existing = projectRepository.findById(id).orElseThrow();
        if (!existing.getOwner().getId().equals(user.getId())) {
            return ResponseEntity.status(403).build();
        }
        projectRepository.delete(existing);
        return ResponseEntity.noContent().build();
    }

    // ============================================
    // Like/Unlike Project Endpoint
    // ============================================
    @PostMapping("/{id}/like")
    public ResponseEntity<Map<String, Object>> toggleLike(@PathVariable Long id) {
        Users user = currentUserProvider.getCurrentUser();
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Project not found"));

        Optional<ProjectLike> existingLike = projectLikeRepository
                .findByProjectIdAndUserId(id, user.getId());

        boolean isLiked;
        if (existingLike.isPresent()) {
            // Unlike - remove the like
            projectLikeRepository.delete(existingLike.get());
            isLiked = false;
        } else {
            // Like - add new like
            ProjectLike like = ProjectLike.builder()
                    .project(project)
                    .user(user)
                    .createdAt(Instant.now())
                    .build();
            projectLikeRepository.save(like);
            isLiked = true;
        }

        // Update the likes count
        long likesCount = projectLikeRepository.countByProjectId(id);
        project.setLikesCount((int) likesCount);
        projectRepository.save(project);

        Map<String, Object> response = new HashMap<>();
        response.put("likesCount", likesCount);
        response.put("isLiked", isLiked);
        response.put("message", isLiked ? "Project liked" : "Project unliked");

        return ResponseEntity.ok(response);
    }

    // Check if current user liked a project
    @GetMapping("/{id}/liked")
    public ResponseEntity<Map<String, Boolean>> checkIfLiked(@PathVariable Long id) {
        Users user = currentUserProvider.getCurrentUser();
        boolean isLiked = projectLikeRepository.existsByProjectIdAndUserId(id, user.getId());

        Map<String, Boolean> response = new HashMap<>();
        response.put("isLiked", isLiked);

        return ResponseEntity.ok(response);
    }

    // ============================================
    // Search Projects Endpoint
    // ============================================
    @GetMapping("/search")
    public ResponseEntity<List<ProjectDTO>> searchProjects(
            @RequestParam String query,
            Authentication authentication) {

        String email = authentication.getName();
        Users currentUser = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Search in title and abstract (case-insensitive)
        List<Project> projects = projectRepository.findAll().stream()
                .filter(project ->
                        project.getTitle().toLowerCase().contains(query.toLowerCase()) ||
                                (project.getAbstractText() != null &&
                                        project.getAbstractText().toLowerCase().contains(query.toLowerCase()))
                )
                .limit(5) // Limit to 5 results
                .collect(Collectors.toList());

        // Convert to DTOs using the existing helper method
        List<ProjectDTO> projectDTOs = projects.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());

        return ResponseEntity.ok(projectDTOs);
    }

    // Helper method to convert Project entity to ProjectDTO
    private ProjectDTO convertToDTO(Project project) {
        OwnerDto ownerDTO = null;
        if (project.getOwner() != null) {
            ownerDTO = OwnerDto.builder()
                    .id(project.getOwner().getId())
                    .fullName(project.getOwner().getFullName())
                    .email(project.getOwner().getEmail())
                    .build();
        }

        return ProjectDTO.builder()
                .id(project.getId())
                .title(project.getTitle())
                .abstractText(project.getAbstractText())
                .imageUrl(project.getImageUrl())
                .status(project.getStatus())
                .likesCount(project.getLikesCount())
                .createdAt(project.getCreatedAt())
                .tags(project.getTags())
                .techStack(project.getTechStack())
                .owner(ownerDTO)
                .build();
    }
}