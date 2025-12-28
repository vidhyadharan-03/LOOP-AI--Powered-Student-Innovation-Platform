package com.trio.loop.dto;

import lombok.*;
import java.time.Instant;
import java.util.List;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor @Builder
public class ProjectDTO {
    private Long id;
    private String title;
    private String abstractText;
    private String imageUrl;
    private String status;
    private Integer likesCount;
    private Instant createdAt;
    private List<String> tags;
    private List<String> techStack;
    private OwnerDto owner;
}