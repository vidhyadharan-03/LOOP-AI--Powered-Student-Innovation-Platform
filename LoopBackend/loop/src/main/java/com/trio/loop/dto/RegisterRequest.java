package com.trio.loop.dto;

public record RegisterRequest(
        String fullName,
        String email,
        String password
) {}
