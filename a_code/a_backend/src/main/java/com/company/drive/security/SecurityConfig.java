package com.company.drive.security;
import org.springframework.context.annotation.*;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
@Configuration @EnableWebSecurity public class SecurityConfig {
 private final JwtAuthenticationFilter filter; private final UserDetailsServiceImpl users; private final ApiSecurityErrorHandler errors;
 public SecurityConfig(JwtAuthenticationFilter filter, UserDetailsServiceImpl users, ApiSecurityErrorHandler errors) {this.filter=filter;this.users=users;this.errors=errors;}
 @Bean PasswordEncoder passwordEncoder(){return new BCryptPasswordEncoder();}
 @Bean AuthenticationProvider authenticationProvider(PasswordEncoder encoder){var p=new DaoAuthenticationProvider();p.setUserDetailsService(users);p.setPasswordEncoder(encoder);return p;}
 @Bean SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception { return http.csrf(c->c.disable()).cors(c->{}).sessionManagement(s->s.sessionCreationPolicy(SessionCreationPolicy.STATELESS)).exceptionHandling(e->e.authenticationEntryPoint(errors).accessDeniedHandler(errors)).authorizeHttpRequests(a->a.requestMatchers("/api/auth/**").permitAll().requestMatchers(HttpMethod.OPTIONS,"/**").permitAll().anyRequest().authenticated()).authenticationProvider(authenticationProvider(passwordEncoder())).addFilterBefore(filter,UsernamePasswordAuthenticationFilter.class).build(); }
}
