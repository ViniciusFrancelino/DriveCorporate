package com.company.drive.dto;
import com.company.drive.entity.Folder;
import java.time.LocalDateTime;
public record FolderResponse(Long id, String name, Long parentFolderId, LocalDateTime createdAt) {
 public static FolderResponse from(Folder f) { return new FolderResponse(f.getId(), f.getName(), f.getParentFolder() == null ? null : f.getParentFolder().getId(), f.getCreatedAt()); }
}
