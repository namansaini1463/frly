package com.example.frly.group.repository;

import com.example.frly.group.enums.GroupInviteStatus;
import com.example.frly.group.model.GroupInviteToken;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

public interface GroupInviteTokenRepository extends JpaRepository<GroupInviteToken, Long> {

    Optional<GroupInviteToken> findFirstByTokenHashAndStatusAndExpiresAtAfter(String tokenHash, GroupInviteStatus status, Instant now);

    List<GroupInviteToken> findByUserIdAndStatusAndExpiresAtAfterOrderByCreatedAtDesc(Long userId, GroupInviteStatus status, Instant now);

    List<GroupInviteToken> findByGroupIdAndUserIdAndStatus(Long groupId, Long userId, GroupInviteStatus status);
}
