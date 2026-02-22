package com.example.frly.group.dto;

import com.example.frly.group.enums.GroupInviteStatus;
import lombok.Data;

import java.time.Instant;

@Data
public class GroupInviteSummaryDto {
    private Long id;
    private Long groupId;
    private String groupDisplayName;
    private String email;
    private GroupInviteStatus status;
    private Instant createdAt;
    private Instant expiresAt;
}
