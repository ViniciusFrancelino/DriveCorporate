package com.company.drive.service;
import com.company.drive.dto.*;
import com.company.drive.entity.User;
import com.company.drive.exception.BadRequestException;
import com.company.drive.repository.UserRepository;
import com.company.drive.security.JwtService;
import com.company.drive.security.UserDetailsServiceImpl;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
@Service public class AuthService {
 private final UserRepository users; private final PasswordEncoder encoder; private final AuthenticationManager auth; private final JwtService jwt; private final UserDetailsServiceImpl details;
 public AuthService(UserRepository users,PasswordEncoder encoder,AuthenticationManager auth,JwtService jwt,UserDetailsServiceImpl details){this.users=users;this.encoder=encoder;this.auth=auth;this.jwt=jwt;this.details=details;}
 @Transactional public UserResponse register(RegisterRequest r){String email=r.getEmail().trim().toLowerCase();if(users.existsByEmail(email))throw new BadRequestException("E-mail já cadastrado");User u=new User();u.setName(r.getName().trim());u.setEmail(email);u.setPassword(encoder.encode(r.getPassword()));return UserResponse.from(users.save(u));}
 public LoginResponse login(LoginRequest r){String email=r.getEmail().trim().toLowerCase();auth.authenticate(new UsernamePasswordAuthenticationToken(email,r.getPassword()));User u=users.findByEmail(email).orElseThrow();return new LoginResponse(jwt.generateToken(details.loadUserByUsername(email)),UserResponse.from(u));}
}
