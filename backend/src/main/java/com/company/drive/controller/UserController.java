package com.company.drive.controller;

import com.company.drive.dto.*;
import com.company.drive.service.UserService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users/me")
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {
    private final UserService service;

    public UserController(UserService service) {
        this.service = service;
    }

    @GetMapping
    public CurrentUserResponse me() {
        return service.me();
    }

    @PutMapping("/profile")
    public CurrentUserResponse updateProfile(@Valid @RequestBody UpdateProfileRequest request) {
        return service.updateProfile(request);
    }

    @PutMapping("/email")
    public CurrentUserResponse updateEmail(@Valid @RequestBody UpdateEmailRequest request) {
        return service.updateEmail(request);
    }

    @PutMapping("/password")
    public MessageResponse changePassword(@Valid @RequestBody ChangePasswordRequest request) {
        return service.changePassword(request);
    }

    @GetMapping("/kpis")
    public UserKpiResponse kpis() {
        return service.kpis();
    }
}
