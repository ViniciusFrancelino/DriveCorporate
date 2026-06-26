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
  try { String token=header.substring(7); String subject=jwt.extractUsername(token); if(subject!=null&&SecurityContextHolder.getContext().getAuthentication()==null) { UserDetails d; boolean valid; try { d=users.loadUserById(Long.valueOf(subject)); valid=jwt.isValidForSubject(token,subject); } catch(NumberFormatException e) { d=users.loadUserByUsername(subject); valid=jwt.isValid(token,d); } if(valid&&d.isEnabled()) { var auth=new UsernamePasswordAuthenticationToken(d,null,d.getAuthorities()); auth.setDetails(new WebAuthenticationDetailsSource().buildDetails(request)); SecurityContextHolder.getContext().setAuthentication(auth); } } } catch(Exception ignored) { }
  chain.doFilter(request,response);
 }
}
