package com.substring.auth.app.auth.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;

@Entity
@Table(name = "access_token_blacklist", indexes = {
        @Index(name = "access_token_blacklist_expires_at_idx", columnList = "expiresAt")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AccessTokenBlacklist {
    @Id
    @Column(nullable = false, updatable = false, length = 80)
    private String jti;

    @Column(nullable = false, updatable = false)
    private Instant expiresAt;
}
