package com.substring.auth.app.auth.config;

import com.substring.auth.app.auth.entities.Provider;
import com.substring.auth.app.auth.entities.RefreshToken;
import com.substring.auth.app.auth.entities.Role;
import com.substring.auth.app.auth.entities.User;
import com.substring.auth.app.auth.repositories.RefreshTokenRepository;
import com.substring.auth.app.auth.repositories.RoleRepository;
import com.substring.auth.app.auth.repositories.UserRepository;
import com.substring.auth.app.auth.services.impl.CookieService;
import com.substring.auth.app.auth.services.impl.JwtService;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.time.Instant;
import java.util.Locale;
import java.util.UUID;

@Component
@RequiredArgsConstructor
public class OAuth2SuccessHandler implements AuthenticationSuccessHandler {

    private static final Logger log = LoggerFactory.getLogger(OAuth2SuccessHandler.class);
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final JwtService jwtService;
    private final CookieService cookieService;
    private final RefreshTokenRepository refreshTokenRepository;

    @Value("${app.auth.frontend.success-redirect}")
    private String frontEndSuccessUrl;

    @Value("${app.auth.frontend.failure-redirect}")
    private String frontEndFailureUrl;

    @Override
    @Transactional
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
        try {
            OAuth2AuthenticationToken oauthToken = (OAuth2AuthenticationToken) authentication;
            OAuth2User oauthUser = oauthToken.getPrincipal();
            String registrationId = oauthToken.getAuthorizedClientRegistrationId().toLowerCase(Locale.ROOT);

            User user = switch (registrationId) {
                case "google" -> upsertGoogleUser(oauthUser);
                case "github" -> upsertGithubUser(oauthUser);
                default -> throw new IllegalArgumentException("Unsupported OAuth provider: " + registrationId);
            };

            RefreshToken refreshTokenRow = RefreshToken.builder()
                    .jti(UUID.randomUUID().toString())
                    .user(user)
                    .revoked(false)
                    .createdAt(Instant.now())
                    .expiresAt(Instant.now().plusSeconds(jwtService.getRefreshTtlSeconds()))
                    .build();
            refreshTokenRepository.save(refreshTokenRow);

            String refreshToken = jwtService.generateRefreshToken(user, refreshTokenRow.getJti());
            cookieService.attachRefreshCookie(response, refreshToken, (int) jwtService.getRefreshTtlSeconds());
            cookieService.addNoStoreHeaders(response);

            log.info("OAuth login succeeded for provider={} userId={}", registrationId, user.getId());
            response.sendRedirect(frontEndSuccessUrl);
        } catch (Exception ex) {
            log.warn("OAuth login failed: {}", ex.getMessage());
            response.sendRedirect(frontEndFailureUrl);
        }
    }

    private User upsertGoogleUser(OAuth2User oauthUser) {
        String email = attribute(oauthUser, "email");
        String providerId = attribute(oauthUser, "sub");
        String name = attribute(oauthUser, "name");
        String image = attribute(oauthUser, "picture");
        return upsertOAuthUser(email, name, image, Provider.GOOGLE, providerId);
    }

    private User upsertGithubUser(OAuth2User oauthUser) {
        String login = attribute(oauthUser, "login");
        String providerId = attribute(oauthUser, "id");
        String email = attribute(oauthUser, "email");
        if (email == null || email.isBlank()) {
            email = login + "@users.noreply.github.com";
        }
        String image = attribute(oauthUser, "avatar_url");
        return upsertOAuthUser(email, login, image, Provider.GITHUB, providerId);
    }

    private User upsertOAuthUser(String email, String name, String image, Provider provider, String providerId) {
        if (email == null || email.isBlank()) {
            throw new IllegalArgumentException("OAuth provider did not return an email address");
        }

        Role userRole = roleRepository.findByName(AppConstants.ROLE_PREFIX + AppConstants.USER_ROLE)
                .orElseThrow(() -> new IllegalStateException("Default role ROLE_USER is missing"));

        User user = userRepository.findByEmail(email.trim().toLowerCase()).orElseGet(User::new);
        user.setEmail(email.trim().toLowerCase());
        if (user.getName() == null || user.getName().isBlank()) {
            user.setName(name);
        }
        if (image != null && !image.isBlank()) {
            user.setImage(image);
        }
        user.setProvider(provider);
        user.setProviderId(providerId);
        user.setEnable(true);
        user.getRoles().add(userRole);
        return userRepository.save(user);
    }

    private String attribute(OAuth2User user, String key) {
        Object value = user.getAttributes().get(key);
        return value == null ? null : value.toString();
    }
}
