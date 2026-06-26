package com.company.drive.service;
import com.company.drive.entity.User;
import com.company.drive.exception.AccessDeniedException;
import com.company.drive.exception.ResourceNotFoundException;
import com.company.drive.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
@Service public class CurrentUserService {
 private final UserRepository users; public CurrentUserService(UserRepository users){this.users=users;}
 public User get(){Authentication a=SecurityContextHolder.getContext().getAuthentication(); if(a==null||!a.isAuthenticated()||"anonymousUser".equals(a.getName())) throw new ResourceNotFoundException("Usuário autenticado não encontrado"); User user=users.findByEmail(a.getName()).orElseThrow(()->new ResourceNotFoundException("Usuário autenticado não encontrado")); if(!user.isActive()) throw new AccessDeniedException("Conta desativada."); return user;}
}
