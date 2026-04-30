package com.substring.auth.app.auth.services.impl;

import com.substring.auth.app.auth.payload.RegisterRequest;
import com.substring.auth.app.auth.payload.UserDto;
import com.substring.auth.app.auth.services.AuthService;
import com.substring.auth.app.auth.services.UserService;
import lombok.AllArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserService userService;
    private  final PasswordEncoder passwordEncoder;


    @Override
    public UserDto registerUser(RegisterRequest request) {
        UserDto userDto = UserDto.builder()
                .name(request.name().trim())
                .email(request.email().trim().toLowerCase())
                .password(passwordEncoder.encode(request.password()))
                .build();
        return userService.createUser(userDto);
    }
}
