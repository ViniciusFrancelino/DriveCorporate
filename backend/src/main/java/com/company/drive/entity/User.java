package com.company.drive.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity @Table(name = "users", uniqueConstraints = @UniqueConstraint(columnNames = "email"))
@Getter @Setter @NoArgsConstructor
public class User {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @Column(nullable = false, length = 120) private String name;
    @Column(nullable = false, length = 190) private String email;
    @Column(nullable = false) private String password;
    @Column(nullable = false, columnDefinition = "boolean default true") private boolean active = true;
    @Column(nullable = false, updatable = false) private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    @PrePersist void beforeCreate() { createdAt = LocalDateTime.now(); updatedAt = createdAt; }
    @PreUpdate void beforeUpdate() { updatedAt = LocalDateTime.now(); }
}
