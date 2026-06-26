package com.company.drive.service;
import com.company.drive.dto.*;
import com.company.drive.entity.User;
import com.company.drive.exception.BadRequestException;
import com.company.drive.repository.UserRepository;
import com.company.drive.security.JwtService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
@Service public class AuthService {
 private final UserRepository users; private final PasswordEncoder encoder; private final AuthenticationManager auth; private final JwtService jwt;
 public AuthService(UserRepository users,PasswordEncoder encoder,AuthenticationManager auth,JwtService jwt){this.users=users;this.encoder=encoder;this.auth=auth;this.jwt=jwt;}
 @Transactional public UserResponse register(RegisterRequest r){String email=r.getEmail().trim().toLowerCase();if(users.existsByEmail(email))throw new BadRequestException("E-mail já cadastrado");User u=new User();u.setName(r.getName().trim());u.setEmail(email);u.setPassword(encoder.encode(r.getPassword()));return UserResponse.from(users.save(u));}
 public LoginResponse login(LoginRequest r){String email=r.getEmail().trim().toLowerCase();User u=users.findByEmail(email).orElseThrow(()->new BadRequestException("E-mail ou senha inválidos"));if(!u.isActive())throw new BadRequestException("Conta desativada.");auth.authenticate(new UsernamePasswordAuthenticationToken(email,r.getPassword()));return new LoginResponse(jwt.generateToken(u),UserResponse.from(u));}
}
