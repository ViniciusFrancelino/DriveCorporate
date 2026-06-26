package com.company.drive.dto;

import java.util.List;

public record FavoritesResponse(List<FolderResponse> folders, List<FileResponse> files) {}
