package com.company.drive.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ChangePasswordRequest(
    @NotBlank(message = "Senha atual é obrigatória")
    String currentPassword,
    @NotBlank(message = "Nova senha é obrigatória")
    @Size(min = 6, message = "Nova senha deve ter no mínimo 6 caracteres")
    String newPassword,
    @NotBlank(message = "Confirmação de senha é obrigatória")
    String confirmPassword
) {}
