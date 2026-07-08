package com.company.drive.dto;
import jakarta.validation.constraints.*;
import lombok.Getter; import lombok.Setter;
@Getter @Setter public class FolderRequest { @NotBlank @Size(max=150) private String name; private Long parentFolderId; }
