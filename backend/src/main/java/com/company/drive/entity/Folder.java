package com.company.drive.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity @Table(name = "folders")
@Getter @Setter @NoArgsConstructor
public class Folder {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @Column(nullable = false, length = 150) private String name;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "parent_folder_id") private Folder parentFolder;
    @ManyToOne(fetch = FetchType.LAZY, optional = false) @JoinColumn(name = "user_id", nullable = false) private User user;
    @Column(nullable = false, columnDefinition = "boolean default false") private boolean favorite = false;
    @Column(nullable = false, updatable = false) private LocalDateTime createdAt;
    @Column(nullable = false) private LocalDateTime updatedAt;
    @PrePersist void beforeCreate() { createdAt = LocalDateTime.now(); updatedAt = createdAt; }
    @PreUpdate void beforeUpdate() { updatedAt = LocalDateTime.now(); }
}
