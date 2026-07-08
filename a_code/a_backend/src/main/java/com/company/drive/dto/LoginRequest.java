package com.company.drive.dto;
import jakarta.validation.constraints.*;
import lombok.Getter; import lombok.Setter;
@Getter @Setter public class LoginRequest { @NotBlank @Email private String email; @NotBlank private String password; }
