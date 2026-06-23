package com.company.drive.dto;
import com.company.drive.entity.User;
public record UserResponse(Long id, String name, String email) { public static UserResponse from(User u) { return new UserResponse(u.getId(), u.getName(), u.getEmail()); } }
