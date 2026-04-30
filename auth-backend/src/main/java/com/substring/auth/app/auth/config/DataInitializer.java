package com.substring.auth.app.auth.config;

import com.substring.auth.app.auth.entities.Role;
import com.substring.auth.app.auth.repositories.RoleRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {
    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);
    private final RoleRepository roleRepository;

    @Override
    public void run(String... args) {
        List.of(AppConstants.USER_ROLE, AppConstants.ADMIN_ROLE)
                .forEach(role -> ensureRole(AppConstants.ROLE_PREFIX + role));
    }

    private void ensureRole(String name) {
        roleRepository.findByName(name).orElseGet(() -> {
            log.info("Creating missing security role {}", name);
            return roleRepository.save(Role.builder().name(name).build());
        });
    }
}
