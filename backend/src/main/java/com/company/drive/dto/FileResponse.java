package com.company.drive.dto;

import com.company.drive.entity.FileEntity;
import java.time.LocalDateTime;

public record FileResponse(Long id, String originalName, String extension, String contentType, Long size,
                           Long folderId, String folderName, boolean favorite, LocalDateTime createdAt,
                           LocalDateTime updatedAt) {
    public static FileResponse from(FileEntity file) {
        return new FileResponse(file.getId(), file.getOriginalName(), file.getExtension(), file.getContentType(),
            file.getSize(), file.getFolder() == null ? null : file.getFolder().getId(),
            file.getFolder() == null ? null : file.getFolder().getName(), file.isFavorite(),
            file.getCreatedAt(), file.getUpdatedAt());
    }
}
