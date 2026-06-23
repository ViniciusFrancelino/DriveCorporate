package com.company.drive.controller;
import com.company.drive.dto.*;
import com.company.drive.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
@RestController @RequestMapping("/api/auth") @CrossOrigin(origins="http://localhost:5173") public class AuthController { private final AuthService service; public AuthController(AuthService service){this.service=service;} @PostMapping("/register") @ResponseStatus(HttpStatus.CREATED) public UserResponse register(@Valid @RequestBody RegisterRequest request){return service.register(request);} @PostMapping("/login") public LoginResponse login(@Valid @RequestBody LoginRequest request){return service.login(request);} }
