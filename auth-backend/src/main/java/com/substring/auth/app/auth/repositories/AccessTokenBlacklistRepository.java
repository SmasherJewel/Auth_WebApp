package com.substring.auth.app.auth.repositories;

import com.substring.auth.app.auth.entities.AccessTokenBlacklist;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AccessTokenBlacklistRepository extends JpaRepository<AccessTokenBlacklist, String> {
}
