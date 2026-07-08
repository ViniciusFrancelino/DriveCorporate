package com.company.drive.dto;
import jakarta.validation.constraints.*;
import lombok.Getter; import lombok.Setter;
@Getter @Setter public class RegisterRequest {
 @NotBlank @Size(max=120) private String name;
 @NotBlank @Email @Size(max=190) private String email;
 @NotBlank @Size(min=6, max=100) private String password;
}
