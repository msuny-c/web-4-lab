package ru.itmo.app.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

public @Data class UserDTO {
    @NotBlank(message = "Username is required.")
    @Size(min = 5, message = "Username must be at least 5 characters long")
    private String username;
    @NotBlank(message = "Password is required.")
    @Size(min = 6, message = "Password must be at least 6 characters long")
    private String password;
}
