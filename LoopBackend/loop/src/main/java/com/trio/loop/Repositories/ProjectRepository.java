package com.trio.loop.Repositories;

import com.trio.loop.model.Project;
import com.trio.loop.model.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {
    List<Project> findByStatus(String status);
    List<Project> findByOwner(Users owner);

    // Add these new methods
    long countByStatus(String status);
}