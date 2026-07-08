package com.company.drive.dto;

import java.util.List;

public record FolderContentsResponse(
    FolderResponse folder,
    List<FolderResponse> subFolders,
    List<FileResponse> files
) { }
