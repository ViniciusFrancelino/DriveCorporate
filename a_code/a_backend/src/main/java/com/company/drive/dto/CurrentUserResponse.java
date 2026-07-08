package com.company.drive.dto;

import com.company.drive.entity.User;
import java.time.LocalDateTime;

public record CurrentUserResponse(Long id, String name, String email, LocalDateTime createdAt, LocalDateTime updatedAt) {
    public static CurrentUserResponse from(User user) {
        LocalDateTime updatedAt = user.getUpdatedAt() == null ? user.getCreatedAt() : user.getUpdatedAt();
        return new CurrentUserResponse(user.getId(), user.getName(), user.getEmail(), user.getCreatedAt(), updatedAt);
    }
}
