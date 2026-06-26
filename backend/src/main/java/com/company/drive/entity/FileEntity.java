package com.company.drive.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity @Table(name = "files", uniqueConstraints = @UniqueConstraint(columnNames = "stored_name"))
@Getter @Setter @NoArgsConstructor
public class FileEntity {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @Column(nullable = false) private String originalName;
    @Column(name = "stored_name", nullable = false) private String storedName;
    @Column(nullable = false, length = 12) private String extension;
    @Column(nullable = false) private String contentType;
    @Column(nullable = false) private Long size;
    @Column(nullable = false, length = 1000) private String storagePath;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "folder_id") private Folder folder;
    @ManyToOne(fetch = FetchType.LAZY, optional = false) @JoinColumn(name = "user_id", nullable = false) private User user;
    @Column(nullable = false) private boolean deleted = false;
    @Column(nullable = false, columnDefinition = "boolean default false") private boolean favorite = false;
    @Column(nullable = false, updatable = false) private LocalDateTime createdAt;
    @Column(nullable = false) private LocalDateTime updatedAt;
    @PrePersist void beforeCreate() { createdAt = LocalDateTime.now(); updatedAt = createdAt; }
    @PreUpdate void beforeUpdate() { updatedAt = LocalDateTime.now(); }
}
