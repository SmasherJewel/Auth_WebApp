package com.substring.auth.app.auth.payload;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record UpdateProfileRequest(
        @NotBlank(message = "Name is required")
        @Size(min = 2, max = 120, message = "Name must be 2 to 120 characters")
        String name
) {
}
