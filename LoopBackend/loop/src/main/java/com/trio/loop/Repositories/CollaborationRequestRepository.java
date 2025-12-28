package com.trio.loop.Repositories;

import com.trio.loop.model.CollaborationRequest;
import com.trio.loop.model.Users;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CollaborationRequestRepository extends JpaRepository<CollaborationRequest, Long> {
    List<CollaborationRequest> findByToUser(Users toUser);
    List<CollaborationRequest> findByFromUser(Users fromUser);
}
