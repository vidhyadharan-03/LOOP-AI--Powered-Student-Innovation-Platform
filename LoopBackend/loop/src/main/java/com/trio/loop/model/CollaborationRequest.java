package com.trio.loop.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

@Entity
@Table(name = "collab_requests")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor @Builder
public class CollaborationRequest {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id")
    private Project project;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "from_user_id")
    private Users fromUser;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "to_user_id")
    private Users toUser;

    @Column(nullable = false)
    private String type; // COLLAB / TAKEOVER

    @Column(nullable = false)
    private String status; // PENDING / ACCEPTED / REJECTED

    private String message;

    private Instant createdAt;
}
