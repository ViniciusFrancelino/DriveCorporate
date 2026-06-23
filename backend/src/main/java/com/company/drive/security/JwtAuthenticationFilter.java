package com.company.drive.security;
import jakarta.servlet.*; import jakarta.servlet.http.*;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.stereotype.Component;
import java.io.IOException;
@Component public class JwtAuthenticationFilter extends OncePerRequestFilter {
 private final JwtService jwt; private final UserDetailsServiceImpl users;
 public JwtAuthenticationFilter(JwtService jwt, UserDetailsServiceImpl users) { this.jwt=jwt; this.users=users; }
 @Override protected void doFilterInternal(HttpServletRequest request,HttpServletResponse response,FilterChain chain) throws ServletException,IOException {
  String header=request.getHeader("Authorization"); if(header==null||!header.startsWith("Bearer ")) { chain.doFilter(request,response); return; }
  try { String token=header.substring(7); String email=jwt.extractUsername(token); if(email!=null&&SecurityContextHolder.getContext().getAuthentication()==null) { UserDetails d=users.loadUserByUsername(email); if(jwt.isValid(token,d)) { var auth=new UsernamePasswordAuthenticationToken(d,null,d.getAuthorities()); auth.setDetails(new WebAuthenticationDetailsSource().buildDetails(request)); SecurityContextHolder.getContext().setAuthentication(auth); } } } catch(Exception ignored) { }
  chain.doFilter(request,response);
 }
}
