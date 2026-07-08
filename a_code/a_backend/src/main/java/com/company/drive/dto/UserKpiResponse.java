package com.company.drive.dto;

public record UserKpiResponse(long totalFiles, long totalFolders, long storageUsedBytes, String storageUsedFormatted) {}
