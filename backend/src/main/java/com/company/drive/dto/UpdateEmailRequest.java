package com.company.drive.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record UpdateEmailRequest(
    @NotBlank(message = "E-mail é obrigatório")
    @Email(message = "E-mail inválido")
    String email,
    @NotBlank(message = "Senha atual é obrigatória")
    String currentPassword
) {}
