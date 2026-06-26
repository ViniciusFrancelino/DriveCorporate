package com.company.drive.security;
import com.company.drive.entity.User;
import com.company.drive.repository.UserRepository;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;
@Service public class UserDetailsServiceImpl implements UserDetailsService {
 private final UserRepository users; public UserDetailsServiceImpl(UserRepository users) { this.users=users; }
 public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException { User u=users.findByEmail(email).orElseThrow(()->new UsernameNotFoundException("Usuário não encontrado")); return org.springframework.security.core.userdetails.User.withUsername(u.getEmail()).password(u.getPassword()).authorities("USER").build(); }
 public UserDetails loadUserById(Long id) throws UsernameNotFoundException { User u=users.findById(id).orElseThrow(()->new UsernameNotFoundException("Usuário não encontrado")); return org.springframework.security.core.userdetails.User.withUsername(u.getEmail()).password(u.getPassword()).authorities("USER").build(); }
}
