package com.trio.loop.controller;



import com.trio.loop.Repositories.ProjectRepository;
import com.trio.loop.Repositories.UserRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final ProjectRepository projectRepository;
    private final UserRepository usersRepository;

    public DashboardController(ProjectRepository projectRepository,
                               UserRepository usersRepository) {
        this.projectRepository = projectRepository;
        this.usersRepository = usersRepository;
    }

    @GetMapping("/stats")
    public Map<String, Object> getStats() {
        Map<String, Object> stats = new HashMap<>();

        // Total active projects (LIVE + LOOKING_FOR_TEAM)
        long liveProjects = projectRepository.countByStatus("LIVE");
        long lookingForTeam = projectRepository.countByStatus("LOOKING_FOR_TEAM");
        long activeProjects = liveProjects + lookingForTeam;

        // Total students (users with role STUDENT)
        long students = usersRepository.countByRole("STUDENT");

        // Total projects (as a proxy for collaborations)
        long totalProjects = projectRepository.count();

        // Total mentors (users with role ADMIN or MENTOR)
        long mentors = usersRepository.countByRole("ADMIN");

        stats.put("activeProjects", activeProjects);
        stats.put("students", students);
        stats.put("collaborations", totalProjects); // You can customize this logic
        stats.put("mentors", mentors);

        return stats;
    }
}
