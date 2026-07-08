package com.company.drive.dto;

import jakarta.validation.constraints.NotBlank;

public record DeleteAccountRequest(
    @NotBlank(message = "Senha atual é obrigatória.")
    String currentPassword
) {}
